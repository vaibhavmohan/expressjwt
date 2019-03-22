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
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `is_active` enum('0','1') DEFAULT '0' COMMENT '0 for in active 1 for active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`password`,`is_active`,`created_at`,`updated_at`) values (2,'yashdeep@aeologic.com','password','1',NULL,NULL),(3,'rishabh@aeologic.com','password','1',NULL,NULL),(4,'abhishek@aeologic.com','password','0',NULL,NULL),(12,'vaibhav@aeologic.com','admin@1234','0',NULL,NULL),(18,'vaibhav@aeologic.com','$2b$10$8Vf1O11sD3fsiDbNMEK.hOI6kWOTa2DlxWw7K4HTHocuPJDep/gDO','0',NULL,NULL),(19,'vaibhav@aeologic.com','$2b$10$O7R0NoIEeh9jvU60STwzI.JS8UGaE294QMW1ZBUCgPtj1/ILkRNqK','1',NULL,NULL),(20,'vaibhav@gmail.com','$2b$10$X8o8A6GgGGjVza8XxlMFNu.q8oNU/OgTj59d89MM1zw55ZdBEJu4C','1','2019-03-22 14:00:21','2019-03-22 14:45:49'),(21,'vaibhav@gmail.com','$2b$10$UTGmo.IimrF0Da41mZLD2.e83RRM41bqLu7Ig40./PtRZRY9tOck2','0','2019-03-22 14:29:06','2019-03-22 14:29:06'),(22,'vaibhav@technoscore.com','$2b$10$niCXRpd/N6L81s6A/RSUA.TYZljq3BQmnMR75y2MH.FpfeoWBFr.u','1','2019-03-22 14:36:07','2019-03-22 14:36:07');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
