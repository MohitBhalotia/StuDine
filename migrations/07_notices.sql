create table `notices` (
    `id` varchar(36) not null primary key, 
    `title` varchar(255) not null, 
    `description` text not null, 
    `image` text, 
    `postedBy` varchar(36) ,
    `postedAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null,
    `validUntil` timestamp(3), 
    FOREIGN KEY (`postedBy`) REFERENCES `user` (`id`) ON DELETE SET NULL
);
