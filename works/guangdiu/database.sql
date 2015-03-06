-- phpMyAdmin SQL Dump
-- version 3.4.8
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2015 年 03 月 06 日 09:16
-- 服务器版本: 5.5.28
-- PHP 版本: 5.3.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `spider`
--

-- --------------------------------------------------------

--
-- 表的结构 `gd_content`
--

CREATE TABLE IF NOT EXISTS `gd_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `image` varchar(300) NOT NULL,
  `content` text NOT NULL,
  `prices` varchar(150) NOT NULL,
  `mall` varchar(30) NOT NULL,
  `us` tinyint(2) NOT NULL DEFAULT '0' COMMENT '是否是海淘',
  `url` varchar(300) NOT NULL,
  `source` varchar(30) NOT NULL,
  `source_url` varchar(300) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `us` (`us`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1144684 ;

-- --------------------------------------------------------

--
-- 表的结构 `gd_link`
--

CREATE TABLE IF NOT EXISTS `gd_link` (
  `id` int(11) NOT NULL,
  `cate` varchar(30) NOT NULL,
  `us` tinyint(2) NOT NULL DEFAULT '0' COMMENT '是否是海淘',
  UNIQUE KEY `id` (`id`,`cate`),
  KEY `us` (`us`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `proxy`
--

CREATE TABLE IF NOT EXISTS `proxy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `proxy` varchar(100) NOT NULL,
  `speed` mediumint(8) NOT NULL,
  `errno` smallint(2) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `proxy` (`proxy`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3944 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
