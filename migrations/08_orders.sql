    create table `orders` (
    `id` varchar(36) not null primary key, 
    `userId` varchar(36) , 
    `menuId` varchar(36) , 
    `quantity` int not null, 
    `totalAmount` decimal(10,2) not null, 
    `status` ENUM('Pending', 'Confirmed', 'Delivered', 'Cancelled') default 'Pending' not null, 
    `paymentStatus` ENUM('Paid', 'Unpaid', 'Refunded') default 'Unpaid' not null, 
    `paymentMethod` ENUM('Cash', 'Card', 'Online') default 'Cash' not null, 
    `specialRequest` text, 
    `orderTime` timestamp(3) default CURRENT_TIMESTAMP(3) not null, 
    `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3) not null, 
    FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL, 
    FOREIGN KEY (`menuId`) REFERENCES `menus` (`id`) ON DELETE SET NULL
);
