create table `session` (
    `id` varchar(36) not null primary key, 
    `expiresAt` timestamp(3) not null, 
    `token` varchar(255) not null unique, 
    `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, 
    `updatedAt` timestamp(3) not null, 
    `ipAddress` text, 
    `userAgent` text, 
    `userId` varchar(36) not null references `user` (`id`) on delete cascade
);
