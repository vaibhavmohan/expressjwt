/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.7.25-0ubuntu0.18.04.2 : Database - testing_express_jwt
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`testing_express_jwt` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `testing_express_jwt`;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `is_active` enum('0','1') DEFAULT '0' COMMENT '0 for in active 1 for active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`email`,`password`,`is_active`,`created_at`,`updated_at`) values (2,'vaibhav','vaibhav@aeologic.com','$2b$10$8h.D1S2m9lxrZSaaDINaYeatpidgNP6cjd2zlttL6m0IkDICC10lC','1',NULL,'2019-03-24 12:15:13'),(3,'jkhkjh','vaibhav@aeologic.com','password','1',NULL,'2019-03-24 12:06:28'),(4,'jkhkjh','vaibhav@aeologic.com','password','0',NULL,'2019-03-24 12:06:28'),(20,'jkhkjh','vaibhav@aeologic.com','$2b$10$X8o8A6GgGGjVza8XxlMFNu.q8oNU/OgTj59d89MM1zw55ZdBEJu4C','1','2019-03-22 14:00:21','2019-03-24 12:06:28'),(21,'jkhkjh','vaibhav@aeologic.com','$2b$10$UTGmo.IimrF0Da41mZLD2.e83RRM41bqLu7Ig40./PtRZRY9tOck2','0','2019-03-22 14:29:06','2019-03-24 12:06:28'),(22,'jkhkjh','vaibhav@aeologic.com','$2b$10$NfMVHo34z1PCi2A7GHuxS.aoJp1wc3kSnqnmFSrnWWjhyG/FY83XC','1','2019-03-22 14:36:07','2019-03-24 12:06:28'),(23,'vaibhav','vaibhav@aeologic.com','$2b$10$Z.ptCjBbaioPHWKPCYHMTeDgv6yl9/qDdxQWNIyZYiHrRlsRnYxGW','1','2019-03-24 11:44:03','2019-03-24 12:14:59');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
