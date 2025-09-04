import React from 'react'
import "./Footer.css"
import footer_logo from "../assets/images/care_products/logo.jpeg"
import instagram_icon from "../assets/images/instagram.avif"
import pinterest_icon from "../assets/images/facebook.avif"
import whatsApp_icon from "../assets/images/whatsapp.avif"
import tiktok_icon from "../assets/images/tiktok.png"

export const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>MI HAIR CARE</p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contacts</li>
        </ul>
        <div className="footer-social-icons">
            <div className="footer-icons-container">
                <img src={instagram_icon} alt="" />                
            </div>
            <div className="footer-icons-container">
            <img src={pinterest_icon} alt="" />                
            </div>
            <div className="footer-icons-container">
                <img src={whatsApp_icon} alt="" />                
            </div>
            <div className="footer-icons-container">
                <img src={tiktok_icon} alt="" />                
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2025. All Rights Reserved</p>
            <p>Designed by Jombo.Net Web Engineers</p>
        </div>
    </div>
  )
}
