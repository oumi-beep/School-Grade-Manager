import React from 'react';
import '../../assets/appHeader.css';
import loginImage from '../../assets/images/logo.png';
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import avatar from "../../assets/images/login.jpg";
import Item from "/src/scenes/layout/sidebar/Item.jsx";
import { ToggledContext } from "../../App";

const AppHeader = ({ toggleTheme, handleLoginClick }) => {
    return (
        <header className="headpage">


            <nav className="nav-links">
                <a href="#">Dashboard</a>
                <a href="#">Professors</a>
                <a href="#">Modules and Elements</a>
                <a href="#">FAQ</a>
                <a href="#">Calendar</a>
                <a href='#' >Charts</a>
            </nav>

            <article className="right-section">

                <div className="button">
                    <a href="/" > Logout </a>
                </div>
            </article>
        </header>
    );
};

export default AppHeader;
