create table `issues` (
    `id` varchar(36) not null primary key, 
    `title` varchar(255) not null, 
    `description` text not null, 
    `image` text, 
    `userId` varchar(36) , 
    `status` ENUM('Open', 'Resolved', 'Progress', 'Hold') default 'Open' not null, 
    `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, 
    `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3) not null, 
    FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL
);
