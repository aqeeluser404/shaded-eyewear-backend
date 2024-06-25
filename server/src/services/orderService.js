/*
    dependencies
*/
    const Order = require('../models/orderModel');
    const OrderType = require('../models/orderTypeModel');
    const Sunglasses = require('../models/sunglassesModel')
    const User = require('../models/userModel'); 

/*
    ================================================================= // CLASSES
*/
    class OrderService {
        // ---------------------------------------------------------- CREATE ORDER
        async createOrder(orderData, orderTypeData, userId) {
            
            // INIT ORDER OBJECT TO CALCULATE
            const order = new Order(orderData);
        
            // CALCULATE PRICE AND TOTAL ITEMS --> decrease stock of sunglasses
            order.totalItems = 0;
            order.totalAmount = 0;

            for (let i = 0; i < order.sunglasses.length; i++) {
                const sunglasses = await Sunglasses.findById(order.sunglasses[i]._id);
                if (!sunglasses) {
                    throw new Error('Sunglasses not found');
                }
                sunglasses.stock -= order.sunglasses[i].quantity; // decrease the stock by the quantity of this type of sunglasses ordered
                if (sunglasses.stock < 0) {
                    throw new Error('Not enough stock');
                }
                await sunglasses.save();
                order.totalAmount += sunglasses.price * order.sunglasses[i].quantity; // calculate the total amount based on the price and quantity of each type of sunglasses
                order.totalItems += order.sunglasses[i].quantity; // update totalItems based on the quantity of each type of sunglasses
            }
        
            // DETERMINE ORDERTYPE BASED ON THRESHOLD
            let orderType;

            if (order.orderType) {
                orderType = await OrderType.findById(order.orderType);
                if (!orderType) {
                    throw new Error('OrderType not found');
                }
            } else {
                orderType = new OrderType(orderTypeData);
            }
            if (order.totalAmount >= orderType.priceThreshold) {
                orderType.type = 'delivery';
                order.deliveryDate = new Date(order.orderDate.getTime() + 2*24*60*60*1000);     // 2 days in advance
            } else {
                orderType.type = 'pickup';      
                order.deliveryDate = null;
            }

            // SAVE CALCULATED ORDER FIELDS INTO SECOND OBJECT --> save to the database
            const orderModelData = new Order({
                orderDate: order.orderDate,
                status: 'pending',
                totalItems: order.totalItems,
                totalAmount: order.totalAmount,
                deliveryDate: order.deliveryDate,
                sunglasses: order.sunglasses,
                payment: null,
                user: userId,
                orderType: orderType._id
            })
        
            // SAVE ORDERTYPE AND ORDER TO MONGO
            await orderType.save();
            await orderModelData.save();

            // RETURN THE ORDER OBJECT
            return orderModelData;
        }
        // ----------------------------------------------------------- CANCEL ORDER - ALSO RESETS SUNGLASSES
        async cancelOrder(orderId) {

            // FIND THE ORDER TO CANCEL
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
        
            // Loop through the sunglasses array and increase the stock
            for (let i = 0; i < order.sunglasses.length; i++) {
                const sunglasses = await Sunglasses.findById(order.sunglasses[i]._id);
                if (!sunglasses) {
                    throw new Error('Sunglasses not found');
                }
                sunglasses.stock += order.sunglasses[i].quantity; // increase the stock by the quantity of this type of sunglasses ordered
                await sunglasses.save();
            }
        
            // Remove the orderType
            const orderType = await OrderType.findByIdAndDelete(order.orderType);
            if (!orderType) {
                throw new Error('OrderType not found');
            }
        
            order.status = 'cancelled';
            order.orderType = null;
        
            await order.save();
            return order;
        }    
    }
    module.exports.OrderService = OrderService;
/*
    ================================================================= // SERVICES
*/
    // -------------------------------------------------------------- CREATE ORDER
    module.exports.CreateOrderService = async (id, orderData, orderTypeData) => {
        try {
            const orderService = new OrderService();
    
            // FIND THE USER WHO PLACES ORDER
            const userToUpdate = await User.findById(id);
            if (!userToUpdate) {
                throw new Error('User not found');
            }
    
            try {
                // PLACING THE ORDER
                const newOrder = await orderService.createOrder(orderData, orderTypeData, userToUpdate._id);
    
                const updatedUser = await User.findOneAndUpdate(
                    { _id: id },
                    { $push: { order: newOrder._id } },
                    { new: true }
                );
                
                return true; 
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }
    // -------------------------------------------------------------- CANCEL ORDER
    module.exports.CancelOrderService = async (orderId) => {
        try {
            const orderService = new OrderService();

            // CANCEL THE ORDER
            const cancelledOrder = await orderService.cancelOrder(orderId);
            
            // Get the userId from the cancelledOrder
            const userId = cancelledOrder.user;

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId }, // use userId from the order
                { $pull: { order: orderId } },
                { new: true }
            );
            return true; 
        } catch (error) {
            throw error;
        }
    }
    // -------------------------------------------------------------- FIND ORDER BY ID
    module.exports.FindOrderByIdService = async (id) => {
        try {
            const order = await Order.findById(id)
            if (!order) {
                throw new Error('Order not found')
            }
            return order;
        }
        catch (error) {
            throw error;
        }
    }
    // -------------------------------------------------------------- FIND ALL ORDERS
    module.exports.FindAllOrdersServices = async () => {
        try {
            const orders = await Order.find()
            return orders;
        }
        catch (error) {
            throw error;
        }
    }
    // -------------------------------------------------------------- FIND ALL MY ORDERS
    module.exports.FindAllMyOrdersService = async (userId) => {
        try {
            // FIND THE USER WITH THEIR ORDERS
            const userOrders = await User.findById(userId);
            if (!userOrders) {
                throw new Error('User not found');
            }
            const orders = await Order.find({ _id: { $in: userOrders.order } })
            return orders;
        }
        catch (error) {
            throw error;
        }
    }
    // -------------------------------------------------------------- UPDATE ORDER - ADDS NEW SUNGLASSES TO THE ORDER
    module.exports.UpdateOrdersService = async (id, orderData, orderTypeData) => {
        try {
            // Fetch the order to update
            const orderToUpdate = await Order.findById(id);
            if (!orderToUpdate) {
                throw new Error('Order not found');
            }
    
            // Fetch the orderType to update
            const orderTypeToUpdate = await OrderType.findById(orderToUpdate.orderType);
            if (!orderTypeToUpdate) {
                console.log('OrderType not found for orderType ID:', orderToUpdate.orderType);
                throw new Error('OrderType not found');
            }
    
            // Add new sunglasses to the order
            for (let i = 0; i < orderData.sunglasses.length; i++) {
                const sunglasses = await Sunglasses.findById(orderData.sunglasses[i]._id);
                if (!sunglasses) {
                    throw new Error('Sunglasses not found');
                }
                sunglasses.stock -= orderData.sunglasses[i].quantity; // decrease the stock by the quantity of this type of sunglasses ordered
                if (sunglasses.stock < 0) {
                    throw new Error('Not enough stock');
                }
                await sunglasses.save();
                orderToUpdate.totalAmount += sunglasses.price * orderData.sunglasses[i].quantity; // calculate the total amount based on the price and quantity of each type of sunglasses
                orderToUpdate.totalItems += orderData.sunglasses[i].quantity; // update totalItems based on the quantity of each type of sunglasses
                orderToUpdate.sunglasses.push(orderData.sunglasses[i]); // add the new sunglasses to the order
            }
    
            // Determine the order type based on the updated total amount
            if (orderToUpdate.totalAmount >= orderTypeData.priceThreshold) {
                orderTypeToUpdate.type = 'delivery';
            } else {
                orderTypeToUpdate.type = 'pickup';
            }
    
            // Update the priceThreshold of the orderType
            orderTypeToUpdate.priceThreshold = orderTypeData.priceThreshold;
    
            // Save the updated order and orderType
            await orderToUpdate.save();
            await orderTypeToUpdate.save();
    
            return { updatedOrder: orderToUpdate, updatedOrderType: orderTypeToUpdate };
        } catch (error) {
            throw error;
        }
    }
    // -------------------------------------------------------------- DELETE ORDER - DOES NOT ADD STOCK OF SUNGLASSES BACK
    module.exports.DeleteOrderService = async (id) => {
        try {
            // Fetch the order to delete
            const orderToDelete = await Order.findById(id);
            if (!orderToDelete) {
                throw new Error('Order not found');
            }
    
            // Remove the order from the user
            const updatedUser = await User.findOneAndUpdate(
                { _id: orderToDelete.user },
                { $pull: { order: orderToDelete._id } }
            );
            if (!updatedUser) {
                throw new Error('Failed to update user');
            }
    
            // Delete the associated OrderType if it exists
            if (orderToDelete.orderType) {
                const deletedOrderType = await OrderType.findByIdAndDelete(orderToDelete.orderType);
                if (!deletedOrderType) {
                    throw new Error('Failed to delete OrderType');
                }
            }
    
            // Delete the order
            const deletedOrder = await Order.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw error;
        }
    }