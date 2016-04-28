-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 28, 2016 at 04:28 AM
-- Server version: 5.7.12
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ks`
--

-- --------------------------------------------------------

--
-- Table structure for table `so_answers`
--

CREATE TABLE IF NOT EXISTS `so_answers` (
  `is_accepted` varchar(5) CHARACTER SET utf8 DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `last_activity_date` int(11) DEFAULT NULL,
  `creation_date` int(11) DEFAULT NULL,
  `answer_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `body` varchar(258) CHARACTER SET utf8 DEFAULT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
