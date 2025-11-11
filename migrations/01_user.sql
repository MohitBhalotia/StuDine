create table `user` (
    `id` varchar(36) not null primary key,
    `name` text not null,
    `email` varchar(255) not null unique,
    `emailVerified` boolean not null,
    `image` text,
    `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null,
    `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null,
    `role` text not null,
    `roomNo` text not null,
    `phoneNo` text not null
);