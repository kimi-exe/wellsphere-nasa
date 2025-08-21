import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure nodemailer with a service like Gmail or SendGrid
// For demo purposes, we'll simulate email sending
const createTransporter = () => {
  // In production, you would use real SMTP credentials
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'demo@wellsphere.com',
      pass: process.env.EMAIL_PASS || 'demo-password'
    }
  });
};

export async function POST(request: NextRequest) {
  try {
    const { email, type, message, location } = await request.json();

    if (!email || !type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate notification content based on type
    const getNotificationContent = (type: string, location: string) => {
      const templates = {
        heatwave: {
          subject: `🌡️ Heatwave Alert - ${location}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ef4444; margin: 0;">WellSphere</h1>
                <p style="color: #9ca3af; margin: 5px 0;">Empowering Cities, Enhancing Health</p>
              </div>
              
              <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #ef4444; margin-top: 0;">🌡️ Heatwave Alert</h2>
                <p>Dear User,</p>
                <p>We're alerting you about a potential heatwave in <strong>${location}</strong>.</p>
                <p><strong>Alert Details:</strong></p>
                <ul>
                  <li>Location: ${location}</li>
                  <li>Alert Type: Heatwave Warning</li>
                  <li>Status: Active</li>
                  <li>Timestamp: ${new Date().toLocaleString()}</li>
                </ul>
                
                <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0;">
                  <h3 style="margin-top: 0; color: #ef4444;">Safety Recommendations:</h3>
                  <ul>
                    <li>Stay hydrated by drinking plenty of water</li>
                    <li>Avoid outdoor activities during peak hours (10 AM - 4 PM)</li>
                    <li>Wear light-colored, loose-fitting clothing</li>
                    <li>Use air conditioning or fans when possible</li>
                    <li>Check on elderly neighbors and relatives</li>
                  </ul>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="color: #9ca3af; font-size: 14px;">
                  This notification was sent from WellSphere Environmental Monitoring System
                  <br>NASA Space Apps Challenge 2025
                </p>
              </div>
            </div>
          `
        },
        flood: {
          subject: `💧 Flood Alert - ${location}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #3b82f6; margin: 0;">WellSphere</h1>
                <p style="color: #9ca3af; margin: 5px 0;">Empowering Cities, Enhancing Health</p>
              </div>
              
              <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #3b82f6; margin-top: 0;">💧 Flood Alert</h2>
                <p>We're monitoring flood conditions in <strong>${location}</strong>.</p>
                <p>Please take necessary precautions and stay safe.</p>
              </div>
            </div>
          `
        },
        earthquake: {
          subject: `🌍 Earthquake Alert - ${location}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #f59e0b; margin: 0;">WellSphere</h1>
                <p style="color: #9ca3af; margin: 5px 0;">Empowering Cities, Enhancing Health</p>
              </div>
              
              <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #f59e0b; margin-top: 0;">🌍 Earthquake Alert</h2>
                <p>Earthquake activity detected in <strong>${location}</strong>.</p>
                <p>Please follow earthquake safety protocols.</p>
              </div>
            </div>
          `
        },
        soil: {
          subject: `🌱 Soil Quality Alert - ${location}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0;">WellSphere</h1>
                <p style="color: #9ca3af; margin: 5px 0;">Empowering Cities, Enhancing Health</p>
              </div>
              
              <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #10b981; margin-top: 0;">🌱 Soil Quality Alert</h2>
                <p>Changes in soil quality detected in <strong>${location}</strong>.</p>
                <p>Monitor agricultural and environmental conditions.</p>
              </div>
            </div>
          `
        }
      };

      return templates[type as keyof typeof templates] || templates.heatwave;
    };

    const { subject, html } = getNotificationContent(type, location);

    // For demo purposes, we'll log the email instead of actually sending it
    console.log('Email notification (simulated):', {
      to: email,
      subject,
      type,
      location,
      timestamp: new Date().toISOString()
    });

    // In production, you would uncomment this to actually send emails:
    /*
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@wellsphere.com',
      to: email,
      subject,
      html
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}