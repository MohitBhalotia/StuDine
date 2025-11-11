create table `verification` (
    `id` varchar(36) not null primary key, 
    `identifier` text not null, 
    `value` text not null, 
    `expiresAt` timestamp(3) not null, 
    `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, 
    `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3) not null
);
