-- Active: 1662865736622@@127.0.0.1@3306

CREATE DATABASE tododb DEFAULT CHARACTER SET = 'utf8mb4';

use tododb;

CREATE TABLE
    `tb_todo` (
        `id` int NOT NULL AUTO_INCREMENT,
        `content` text NOT NULL,
        `done` tinyint(1) NOT NULL DEFAULT '0',
        `deadline` varchar(30) DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `id_UNIQUE` (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 30 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

SELECT * from tb_todo;


INSERT INTO `tododb`.`tb_todo` (`content`, `deadline`,`done`) VALUES ('睡觉', '11月24日', '1');
INSERT INTO `tododb`.`tb_todo` (`content`, `deadline`) VALUES ('吃饭', '11月25日');
INSERT INTO `tododb`.`tb_todo` (`content`, `deadline`) VALUES ('写作业', '11月31日');


show create table tb_todo;