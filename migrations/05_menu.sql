create table `menus` (
    `id` varchar(36) not null primary key, 
    `description` text not null, 
    `type` ENUM('Veg', 'Non-veg', 'Jain') not null, 
    `mealTime` ENUM('Breakfast', 'Lunch', 'Snacks', 'Dinner') not null, 
    `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') not null, 
    `price` decimal(10,2) not null, 
    `image` text, 
    `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, 
    `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3) not null
);
