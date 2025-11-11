create table `account` (
    `id` varchar(36) not null primary key, 
    `accountId` text not null, 
    `providerId` text not null, 
    `userId` varchar(36) not null references `user` (`id`) on delete cascade,
    `accessToken` text,
    `refreshToken` text,
    `idToken` text,
    `accessTokenExpiresAt` timestamp(3),
    `refreshTokenExpiresAt` timestamp(3),
    `scope` text,
    `password` text,
    `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null,
    `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3) not null
);
