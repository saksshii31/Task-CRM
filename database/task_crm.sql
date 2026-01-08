CREATE DATABASE  IF NOT EXISTS `crm_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `crm_project`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: crm_project
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campaign_emails`
--

DROP TABLE IF EXISTS `campaign_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_emails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `sender_email` varchar(120) DEFAULT NULL,
  `recipient_email` varchar(120) DEFAULT NULL,
  `status` enum('sent','bounced','failed','scheduled') DEFAULT 'scheduled',
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `campaign_emails_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_emails`
--

LOCK TABLES `campaign_emails` WRITE;
/*!40000 ALTER TABLE `campaign_emails` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_logs`
--

DROP TABLE IF EXISTS `campaign_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `status` enum('Sent','Failed') DEFAULT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_log_campaign` (`campaign_id`),
  CONSTRAINT `fk_log_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_logs`
--

LOCK TABLES `campaign_logs` WRITE;
/*!40000 ALTER TABLE `campaign_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_name` varchar(150) NOT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `sender` varchar(150) DEFAULT NULL,
  `email_body` longtext,
  `sender_id` int DEFAULT NULL,
  `contact_list_id` int DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `status` enum('Draft','Scheduled','Sent','Failed') DEFAULT 'Draft',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `recipients` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_campaign_sender` (`sender_id`),
  KEY `fk_campaign_list` (`contact_list_id`),
  KEY `fk_campaign_user` (`created_by`),
  CONSTRAINT `fk_campaign_list` FOREIGN KEY (`contact_list_id`) REFERENCES `contact_lists` (`id`),
  CONSTRAINT `fk_campaign_sender` FOREIGN KEY (`sender_id`) REFERENCES `senders` (`id`),
  CONSTRAINT `fk_campaign_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (3,'December Dairis','Welcome to december','66,67','<p>hdoqhijdqijwfpojfoj3f</p>',1,NULL,'2026-07-31 06:30:00','Scheduled',1,'2026-01-05 05:54:43','Socialmedia Subscribers'),(4,'January Newsletter','Welcome to 2026','65','<p>qweryuiopjsgfdvncjl</p>',1,NULL,'2026-01-13 21:30:00','Scheduled',1,'2026-01-05 06:01:24','NewsLetter Subscribers'),(7,'New Year Sales Offer','Flat 30% Off - Limited Offer!','67,65,57','<p>Hi there, Kickstart your New Year with exciting discounts! Enjoy flat 30% OFF on all products. Hurry! Offer valid till this weekend. Regards, Sales Team</p>',1,NULL,NULL,'Draft',1,'2026-01-05 06:30:45','Sales Leadssss'),(14,'Product Sales','Flat 30% Off - Limited Offer!','66,3','<p>njugufdfghjklmnbv</p>',1,NULL,'2025-12-14 14:21:00','Sent',1,'2026-01-05 06:52:06','Sales Leads'),(16,'Summer Sale Blast','Flat 40% Off - Summer Special!','6,7,13,15,5','<p>Hello, We are excited to announce our Summer Sale! Enjoy up to 40% OFF on selected products. Hurry up, offer valid for a limited time only. Best Regards, Marketing Team</p>',1,NULL,'2025-07-31 07:03:00','Sent',1,'2026-01-05 07:03:37','NewsLetter Subscribers'),(17,'Book Stock Collection','Buy 1 Get 1 Offer - B!G!','3,4,5,6','<p>SALE! SALE! SALE! Stay tuned for more....</p>',1,NULL,NULL,'Draft',1,'2026-01-05 07:05:40','Sales Leadsss'),(18,'Christmas Patryy','Invitation for party','65,67,57,56','<p>welcome to christmas partyy!</p>',1,NULL,'2026-01-22 02:30:00','Scheduled',1,'2026-01-06 10:33:29','15,14,4'),(19,' Cherry & Mint','Welcome to Our Platform ?','66,65,67','<h2>Welcome Aboard!</h2><p>We’re excited...</p>',1,NULL,NULL,'Draft',1,'2026-01-06 12:06:42','16,15'),(20,'Test Failed Campaign','Delivery Failure','marketing@company.com','This is a dummy failed email campaign',NULL,NULL,'2026-01-06 22:24:20','Failed',1,'2026-01-06 16:54:20','test1@test.com,test2@test.com'),(21,'Product Launch Announcement','Introducing Our New Product','marketing@company.com','New product launch email sent successfully.',NULL,NULL,'2026-01-06 22:28:33','Sent',1,'2026-01-06 16:58:33','user1@test.com,user2@test.com'),(22,'Monthly Newsletter','April Newsletter','newsletter@company.com','Monthly updates and news.',NULL,NULL,'2026-01-06 22:28:33','Sent',1,'2026-01-06 16:58:33','reader1@test.com,reader2@test.com'),(23,'Sales Follow-up','Thank You for Your Interest','sales@company.com','Following up on recent inquiry.',NULL,NULL,'2026-01-06 22:28:33','Sent',1,'2026-01-06 16:58:33','lead1@test.com'),(24,'Upcoming Webinar','Join Our Live Webinar','events@company.com','Invitation for upcoming webinar.',NULL,NULL,'2026-01-09 22:28:33','Scheduled',1,'2026-01-06 16:58:33','guest1@test.com,guest2@test.com'),(25,'Festive Offers','Special Festival Discounts','marketing@company.com','Festival sale email scheduled.',NULL,NULL,'2026-01-11 22:28:33','Scheduled',1,'2026-01-06 16:58:33','buyer1@test.com,buyer2@test.com'),(26,'System Maintenance Alert','Scheduled Maintenance','support@company.com','Upcoming system maintenance notice.',NULL,NULL,'2026-01-07 22:28:33','Sent',1,'2026-01-06 16:58:33','user3@test.com'),(27,'Abandoned Cart Reminder','Complete Your Purchase','sales@company.com','Draft reminder for abandoned carts.',NULL,NULL,NULL,'Draft',1,'2026-01-06 16:58:33','cart1@test.com'),(28,'Customer Feedback Request','We Value Your Feedback','support@company.com','Draft feedback request email.',NULL,NULL,NULL,'Draft',1,'2026-01-06 16:58:33','customer1@test.com'),(29,'HR Announcement','Policy Update','hr@company.com','Draft internal policy update.',NULL,NULL,NULL,'Draft',1,'2026-01-06 16:58:33','staff1@test.com'),(30,'Promo Blast Failure','Limited Time Offer','marketing@company.com','Campaign failed due to bounce.',NULL,NULL,'2026-01-06 22:28:33','Failed',1,'2026-01-06 16:58:33','fake1@test.com,fake2@test.com'),(31,'Server Alert Failure','Critical Server Issue','alerts@company.com','Delivery failed due to SMTP error.',NULL,NULL,'2026-01-06 22:28:33','Failed',1,'2026-01-06 16:58:33','admin@test.com'),(32,'Payment Notification Error','Payment Failed','billing@company.com','Email delivery failed.',NULL,NULL,'2026-01-06 22:28:33','Failed',1,'2026-01-06 16:58:33','payer@test.com'),(33,'Invalid Sender Test','Sender Rejected','invalid@company.com','Sender authentication failed.',NULL,NULL,'2026-01-06 22:28:33','Failed',1,'2026-01-06 16:58:33','test@test.com'),(34,'Timeout Campaign','Connection Timeout','system@company.com','Email sending timed out.',NULL,NULL,'2026-01-06 22:28:33','Failed',1,'2026-01-06 16:58:33','net@test.com'),(35,'Quota Limit Reached','Email Limit Exceeded','system@company.com','Daily quota exceeded.',NULL,NULL,'2026-01-06 22:28:33','Failed',1,'2026-01-06 16:58:33','quota@test.com');
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_list_mapping`
--

DROP TABLE IF EXISTS `contact_list_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_list_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contact_list_id` int NOT NULL,
  `contact_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_clm_list` (`contact_list_id`),
  KEY `fk_clm_contact` (`contact_id`),
  CONSTRAINT `fk_clm_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clm_list` FOREIGN KEY (`contact_list_id`) REFERENCES `contact_lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_list_mapping`
--

LOCK TABLES `contact_list_mapping` WRITE;
/*!40000 ALTER TABLE `contact_list_mapping` DISABLE KEYS */;
INSERT INTO `contact_list_mapping` VALUES (1,1,3),(2,1,2),(12,5,1),(13,5,8),(20,16,18),(21,16,19),(22,16,20),(23,16,21),(24,16,28),(25,16,27),(26,16,26),(27,16,25),(28,16,23),(29,16,24),(30,15,31),(31,15,30),(32,15,29),(33,15,28),(34,15,27),(35,15,1),(36,15,2),(37,15,3),(38,14,30),(39,14,31),(40,14,27),(41,14,28),(42,7,31),(43,7,30),(44,7,29),(45,7,28),(46,7,27),(47,7,5),(48,7,6),(49,7,7),(50,7,8),(51,7,9),(52,7,10),(53,7,11),(54,7,12),(55,7,13),(56,7,15),(57,7,14),(58,7,17),(59,7,16),(60,7,21),(61,7,20),(62,7,19),(63,7,18),(64,7,22),(65,7,23),(66,7,24),(67,7,25),(68,7,26),(69,7,4),(70,7,3),(71,7,2),(72,7,1),(73,9,28),(74,9,31),(75,9,30),(76,9,27),(77,9,29),(78,9,5),(79,9,6),(80,9,7),(81,9,4),(82,9,3),(83,8,29),(84,8,1),(85,8,2),(86,8,6),(87,8,5),(88,8,4),(89,8,3),(90,8,13),(91,8,14),(92,8,15),(93,8,16),(94,8,12),(95,8,11),(96,8,22),(97,8,24),(98,8,23),(99,8,25),(100,11,30),(101,11,29),(102,11,28),(103,11,27),(104,11,31),(105,13,29),(106,13,28),(107,13,27),(108,13,30),(109,13,31),(110,13,4),(111,13,3),(112,13,2),(113,13,1),(114,13,5),(115,13,6),(116,13,11),(117,13,10),(118,13,9),(119,13,8),(120,12,30),(121,12,29),(122,12,27),(123,12,28),(124,12,31),(125,12,16),(126,12,15),(127,12,17),(128,12,18),(129,12,19),(130,12,20),(131,12,2),(132,10,29),(133,10,28),(134,10,27),(135,10,30),(136,10,31),(137,10,19),(138,10,20),(139,10,17),(140,10,18),(141,10,9),(142,10,10),(143,4,3),(144,4,1),(145,4,28),(146,4,29),(147,4,30),(148,4,31),(149,4,27),(150,4,15),(151,4,16),(152,4,17),(153,4,18),(154,6,9),(155,6,8),(156,6,7),(157,6,6),(158,6,1),(159,6,4),(160,6,30),(161,6,29),(162,6,28),(163,3,3),(164,3,2),(165,3,1),(166,3,30),(167,3,5),(168,3,6),(169,3,12),(170,3,11),(171,3,10),(172,3,9);
/*!40000 ALTER TABLE `contact_list_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_lists`
--

DROP TABLE IF EXISTS `contact_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `list_name` varchar(100) NOT NULL,
  `description` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_list_user` (`created_by`),
  CONSTRAINT `fk_list_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_lists`
--

LOCK TABLES `contact_lists` WRITE;
/*!40000 ALTER TABLE `contact_lists` DISABLE KEYS */;
INSERT INTO `contact_lists` VALUES (1,'Sales Leads','Customers interested in promotions and offers!',1,'2026-01-05 10:27:47'),(3,'Newsletters Subscribers','Users subscribed to monthly product updates and newsletters',1,'2026-01-05 10:30:40'),(4,'Event Atendees','Contacts who registered for webinars and company events',1,'2026-01-05 10:31:09'),(5,'Walk-in Drive','Students you are selected for interview!',1,'2026-01-05 10:36:03'),(6,'Meeting- Google Office','Regarding product launch date!',1,'2026-01-05 10:55:01'),(7,'All Contacts','All saved contacts',NULL,'2026-01-06 10:00:41'),(8,'Marketing Leads','Contacts for marketing campaigns',NULL,'2026-01-06 10:00:41'),(9,'Product Users','Active product users',NULL,'2026-01-06 10:00:41'),(10,'Newsletter Subscribers','Monthly newsletter subscribers',NULL,'2026-01-06 10:00:41'),(11,'Event Attendees','People who attended events',NULL,'2026-01-06 10:00:41'),(12,'HR Contacts','Internal HR contacts',NULL,'2026-01-06 10:00:41'),(13,'Sales Prospects','Potential sales leads',NULL,'2026-01-06 10:00:41'),(14,'Support Customers','Customers who contacted support',NULL,'2026-01-06 10:00:41'),(15,'Premium Customers','Paid premium users',NULL,'2026-01-06 10:00:41'),(16,'Inactive Users','Users inactive for 90+ days',NULL,'2026-01-06 10:00:41');
/*!40000 ALTER TABLE `contact_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Rahul Sharma','rahul@gmail.com','9876543210','2026-01-05 10:01:24'),(2,'Neha Patel','neha@gmail.com','9876543211','2026-01-05 10:01:24'),(3,'Aman Verma','aman@gmail.com','9876543212','2026-01-05 10:01:24'),(4,'Will Bayers','will@gmail.com','8897542777','2026-01-05 10:46:14'),(5,'Peter Sanse','peter@gmail.com','7687356478','2026-01-05 10:46:14'),(6,'John Sinclair','john@gmail.com','8879799236','2026-01-05 10:46:14'),(7,'Lucus Poddar','lucus@gmail.com','9899765424','2026-01-05 10:46:14'),(8,'Maxine Fernandes','max@gmail.com','7272747657','2026-01-05 10:46:14'),(9,'Billy Gates','billy@gmail.com','7868912345','2026-01-05 10:46:14'),(10,'Alice Johnson','alice@gmail.com','9123456781','2026-01-06 09:58:43'),(11,'Robert Smith','robert@gmail.com','9123456782','2026-01-06 09:58:43'),(12,'Emily Davis','emily@gmail.com','9123456783','2026-01-06 09:58:43'),(13,'Daniel Brown','daniel@gmail.com','9123456784','2026-01-06 09:58:43'),(14,'Sophia Wilson','sophia@gmail.com','9123456785','2026-01-06 09:58:43'),(15,'Michael Taylor','michael@gmail.com','9123456786','2026-01-06 09:58:43'),(16,'Olivia Anderson','olivia@gmail.com','9123456787','2026-01-06 09:58:43'),(17,'James Thomas','james@gmail.com','9123456788','2026-01-06 09:58:43'),(18,'Ava Martinez','ava@gmail.com','9123456789','2026-01-06 09:58:43'),(19,'Ethan Moore','ethan@gmail.com','9123456790','2026-01-06 09:58:43'),(20,'Isabella Clark','isabella@gmail.com','9123456791','2026-01-06 09:58:43'),(21,'Benjamin Lewis','ben@gmail.com','9123456792','2026-01-06 09:58:43'),(22,'Mia Walker','mia@gmail.com','9123456793','2026-01-06 09:58:43'),(23,'Lucas Hall','lucas@gmail.com','9123456794','2026-01-06 09:58:43'),(24,'Charlotte Allen','charlotte@gmail.com','9123456795','2026-01-06 09:58:43'),(25,'Henry Young','henry@gmail.com','9123456796','2026-01-06 09:58:43'),(26,'Amelia King','amelia@gmail.com','9123456797','2026-01-06 09:58:43'),(27,'Alexander Wright','alex@gmail.com','9123456798','2026-01-06 09:58:43'),(28,'Harper Lopez','harper@gmail.com','9123456799','2026-01-06 09:58:43'),(29,'Sebastian Hill','sebastian@gmail.com','9123456800','2026-01-06 09:58:43'),(30,'Evelyn Scott','evelyn@gmail.com','9123456801','2026-01-06 09:58:43'),(31,'Jack Green','jack@gmail.com','9123456802','2026-01-06 09:58:43');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` int DEFAULT NULL,
  `recipient_email` varchar(120) DEFAULT NULL,
  `status` enum('Sent','Opened','Bounced') DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_email_campaign` (`campaign_id`),
  CONSTRAINT `fk_email_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_logs`
--

LOCK TABLES `email_logs` WRITE;
/*!40000 ALTER TABLE `email_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `template_name` varchar(100) NOT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `email_body` longtext,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_template_user` (`created_by`),
  CONSTRAINT `fk_template_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_templates`
--

LOCK TABLES `email_templates` WRITE;
/*!40000 ALTER TABLE `email_templates` DISABLE KEYS */;
INSERT INTO `email_templates` VALUES (4,'Newsletter','Monthly Update- January','Here\'s what\'s new this month...',1,'2026-01-05 12:22:01'),(5,'Newsletter','Monthly Update – February','<h2>February Updates</h2><p>Hello Subscriber...</p>',1,'2026-01-05 12:43:31'),(6,'Promotion Email','Flat 40% Off – This Weekend Only!','<h2>Limited Time Offer</h2><p>Get flat 40% OFF...</p>',1,'2026-01-05 12:43:31'),(7,'Welcome Email','Welcome to Our Platform ?','<h2>Welcome Aboard!</h2><p>We’re excited...</p>',1,'2026-01-05 12:43:31'),(8,'Password Reset','Reset Your Password','<p>You requested to reset your password...</p>',1,'2026-01-05 12:43:31'),(9,'Event Invitation','You’re Invited – Product Launch Event','<h2>Join Our Live Event</h2><p>We’re launching...</p>',1,'2026-01-05 12:43:31'),(10,'Feedback Email','We’d Love Your Feedback','<p>Your opinion matters to us...</p>',1,'2026-01-05 12:43:31');
/*!40000 ALTER TABLE `email_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_mapping`
--

DROP TABLE IF EXISTS `permission_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `permission_key` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_perm_role` (`role_id`),
  CONSTRAINT `fk_perm_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_mapping`
--

LOCK TABLES `permission_mapping` WRITE;
/*!40000 ALTER TABLE `permission_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `permissions` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','{\"logs_view\": true, \"staff_view\": true, \"sender_view\": true, \"roles_manage\": true, \"staff_create\": true, \"staff_delete\": true, \"staff_update\": true, \"campaign_view\": true, \"sender_create\": true, \"sender_delete\": true, \"sender_update\": true, \"template_view\": true, \"analytics_view\": true, \"campaign_create\": true, \"campaign_delete\": true, \"campaign_update\": true, \"template_create\": true, \"template_delete\": true, \"template_update\": true, \"contactlist_view\": true, \"campaign_schedule\": true, \"contactlist_create\": true, \"contactlist_delete\": true, \"contactlist_update\": true}','2026-01-04 07:34:33','2026-01-04 13:54:03'),(2,'Sales','{\"staff_view\": true, \"sender_view\": true, \"roles_manage\": false, \"staff_create\": false, \"staff_delete\": false, \"staff_update\": true, \"campaign_view\": true, \"sender_create\": false, \"template_view\": true, \"analytics_view\": true, \"campaign_create\": true, \"campaign_update\": true, \"template_create\": true, \"template_update\": true, \"contactlist_view\": true, \"campaign_schedule\": true, \"contactlist_create\": true, \"contactlist_update\": true}','2026-01-04 07:34:33','2026-01-07 11:59:25'),(3,'Marketing','{\"staff_view\": true, \"sender_view\": true, \"staff_create\": false, \"staff_delete\": false, \"staff_update\": false, \"campaign_view\": true, \"template_view\": true, \"analytics_view\": true, \"contactlist_view\": true}','2026-01-04 07:34:33','2026-01-07 11:59:51');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `senders`
--

DROP TABLE IF EXISTS `senders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `senders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_name` varchar(100) NOT NULL,
  `sender_email` varchar(120) NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sender_email` (`sender_email`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `senders`
--

LOCK TABLES `senders` WRITE;
/*!40000 ALTER TABLE `senders` DISABLE KEYS */;
INSERT INTO `senders` VALUES (1,'Marketing Team','marketing@company.com',1,'2026-01-05 12:49:10'),(2,'Sales Team','sales@company.com',1,'2026-01-05 12:49:10'),(3,'Support Team','support@company.com',0,'2026-01-05 12:49:10'),(4,'HR Department','hr@company.com',1,'2026-01-05 12:49:10'),(5,'Admin Notifications','admin@company.com',0,'2026-01-05 12:49:10'),(6,'Product Updates','officialupdates@company.com',1,'2026-01-05 12:49:10'),(7,'Finance Team','finance@gmail.com',0,'2026-01-06 04:49:07'),(13,'Technical Team','officialtech@gmail.com',0,'2026-01-06 05:00:02'),(15,'Productive Team','officials@gmail.com',0,'2026-01-06 05:07:49'),(46,'Product Updates','updates@company.com',1,'2026-01-06 09:56:46'),(47,'Customer Care','care@company.com',1,'2026-01-06 09:56:46'),(48,'Billing Desk','billing@company.com',0,'2026-01-06 09:56:46'),(49,'Security Alerts','security@company.com',1,'2026-01-06 09:56:46'),(50,'Compliance Team','compliance@company.com',1,'2026-01-06 09:56:46'),(51,'Legal Department','legal@company.com',0,'2026-01-06 09:56:46'),(52,'Operations Team','operations@company.com',1,'2026-01-06 09:56:46'),(53,'DevOps Team','devops@company.com',1,'2026-01-06 09:56:46'),(54,'QA Team','qa@company.com',0,'2026-01-06 09:56:46'),(55,'Research Team','research@company.com',1,'2026-01-06 09:56:46'),(56,'Training Cell','training@company.com',0,'2026-01-06 09:56:46'),(57,'Internal News','news@company.com',1,'2026-01-06 09:56:46'),(58,'Event Updates','events@company.com',1,'2026-01-06 09:56:46'),(59,'Partner Desk','partners@company.com',0,'2026-01-06 09:56:46'),(60,'Vendor Support','vendors@company.com',1,'2026-01-06 09:56:46'),(61,'Customer Success','success@company.com',1,'2026-01-06 09:56:46'),(62,'Outreach Team','outreach@company.com',0,'2026-01-06 09:56:46'),(63,'Feedback Desk','feedback@company.com',1,'2026-01-06 09:56:46'),(64,'Survey Team','survey@company.com',0,'2026-01-06 09:56:46'),(65,'Announcements','announce@company.com',1,'2026-01-06 09:56:46'),(66,'IT Helpdesk','ithelp@company.com',1,'2026-01-06 09:56:46'),(67,'System Alerts','alerts@company.com',1,'2026-01-06 09:56:46');
/*!40000 ALTER TABLE `senders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role_id` int NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_role` (`role_id`),
  KEY `fk_staff_user` (`user_id`),
  CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (2,8,'Sakshi','Patil','sakshipatil3107@gmail.com','9833698456',1,'Active','2026-01-04 07:35:03','2026-01-07 11:27:24'),(3,6,'Durgesh','Bapat','durgs@gmail.com','9833698684',3,'Inactive','2026-01-04 07:36:38','2026-01-07 11:27:24'),(4,13,'Shreya','Sakhare','shreya@gmail.com','9833698456',2,'Active','2026-01-04 07:37:45','2026-01-07 11:33:16'),(5,14,'Om','Patil','ompatil2022@kccemsr.edu.in','234567878',3,'Inactive','2026-01-04 07:38:17','2026-01-07 11:33:16'),(6,15,'Manali ','Patkar','manalipatkar12@gmail.com','8764847859',2,'Inactive','2026-01-07 06:30:26','2026-01-07 11:33:16'),(11,16,'Supriya','Verma','supriya56@gmail.com','9887655769',1,'Active','2026-01-07 06:42:09','2026-01-07 11:33:16'),(13,17,'Arya','Patil','arya@gmail.com','4567834567',2,'Inactive','2026-01-07 06:46:49','2026-01-07 11:33:16');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_roles` (`role_id`),
  CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'sakshi','patil','sakshi@gmail.com','$2b$10$q/wKzcOdbTzVTOXu2qp.xOPbjZa9kiVn1Oyi1V8CTOiPi1ENRC.Dy','sss','12345',NULL,NULL,NULL),(2,'Manali','Patkar','manali@gmail.com','$2b$10$N5OU8XvgiTaNhTeKBlGleOtZ3HSU1/QyEMsqJmvXXeKEvDsn/sc8W','xyz','223344',NULL,NULL,NULL),(3,'Kanchan','Patil','kanchan@gmail.com','$2b$10$FpP8ErQ5d.62QZALt6ih1uB9NaPCxXsTwcRM/9ADJ.nV5uXupo9Dq','tata','12341234',NULL,NULL,NULL),(4,'Final','Test','finaltest@gmail.com','$2b$10$hO1P2cB9tk4Fxdfj9KU09emGMjwhIS8ufB1i5ao33AM1obLNbm1mu','CRM','9999999999',NULL,NULL,NULL),(6,'Durgesh','Bapat','durgs@gmail.com','$2b$10$mgUUiYrhEY5UHss9F.z2C.xafct6yPI/szH24i390PclDf31RwK5W','upskill','22222',NULL,NULL,NULL),(7,'Ram','Patil','ram@gmail.com','$2b$10$4g/e0tf2KNw/bjPnr8G.pOSqpFsFkMUzAo2xL2Z5v.f1ocCOwf3Wy','omkar','123456789',NULL,NULL,NULL),(8,'Sakshi','Nikum','sakshipatil3107@gmail.com','$2b$10$/uOPt/sW9EC/Ya4T7bkHjuN8U0Tr1U0IqVP2UYCGCCj4nsh34fBfS','Oracle','321432543',NULL,NULL,NULL),(9,'Manali','Patkar','manalipatkar2022@kccemsr.edu.in','$2b$10$F2xKss9hGVc53RaRjbBASe.T51TlbN.QZy4jPJDcZCjrhQMShMKT6','Google','12345654','8a432bed59865aca944349c2ed525cef57033af0db5f6c3e2c8a5b9e60db5430','2026-01-02 17:12:51',NULL),(10,'Jay','Mahajan','sakshi.skillsconnect@gmail.com','$2b$10$.ydkXCCOPj.OrRX0hxT5FO56MhfYYGUIIl6JDFijrWA9JVToicjcu','DMCE','2233445566',NULL,NULL,NULL),(11,'Dnyaneshwar','Patil','ddpatil75@gmail.com','$2b$10$XymD96HzEMsnbTYSFRigLufullfJJR53O/RVaVyNqmBhNsIhYco9K','Cal Scientific','123456687',NULL,NULL,NULL),(12,'Kanchan ','Patil','kanchanpatil01@gmail.com','$2b$10$LOpJ9BtOgpwcE.1cRXsO9efCSrOvXAWkcB703doWDT56CAhhSYtrC','Arcon','123123456',NULL,NULL,NULL),(13,'Shreya','Sakhare','shreya@gmail.com','$2b$10$TEMP_PASSWORD_HASH',NULL,'9833698456',NULL,NULL,NULL),(14,'Om','Patil','ompatil2022@kccemsr.edu.in','$2b$10$TEMP_PASSWORD_HASH',NULL,'234567878',NULL,NULL,NULL),(15,'Manali ','Patkar','manalipatkar12@gmail.com','$2b$10$TEMP_PASSWORD_HASH',NULL,'8764847859',NULL,NULL,NULL),(16,'Supriya','Verma','supriya56@gmail.com','$2b$10$TEMP_PASSWORD_HASH',NULL,'9887655769',NULL,NULL,NULL),(17,'Arya','Patil','arya@gmail.com','$2b$10$TEMP_PASSWORD_HASH',NULL,'4567834567',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-08 11:22:53
