// Terms.jsx
import React from 'react';
import { Typography, Divider } from '@mui/material';

const Terms = () => (
  <>
    <Typography variant="h6" gutterBottom>
      Terms and Conditions for PSP Fitness Gym Taguig Jr.
    </Typography>
    <Typography variant="body2" paragraph>
      Welcome to the PSP Fitness Gym Application. By downloading the App, you agree to comply with and also be bound by the following Terms and Conditions. Please review and read them carefully before using the Application. If you do not agree to these terms, you should not use the Application.
    </Typography>
    <Divider sx={{ my: 2 }} />

    <Typography variant="subtitle1" gutterBottom>1. Age Requirement</Typography>
    <Typography variant="body2" paragraph>
      You must be at least 18 years old to use the application.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>2. Account Registration</Typography>
    <Typography variant="body2" paragraph>
      To access certain features of the application, you may need to register and create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>3. Membership Features</Typography>
    <Typography variant="body2" paragraph>
      There are limited features available upon creating your account. To unlock more features, you need to subscribe to a membership plan in the PSP Fitness Gym application.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>4. Gym Membership Plans</Typography>
    <Typography variant="body2" paragraph>
      The app offers gym membership plans that provide access to gym services.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>5. Personal Trainer Booking</Typography>
    <Typography variant="body2" paragraph>
      The app also offers the option to book a personal trainer or coach, which is a separate service from the gym membership fee.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>6. Personal Information Collection</Typography>
    <Typography variant="body2" paragraph>
      When applying for membership at PSP Fitness Gym, the app collects personal information such as your name, age, email, address, phone number, signature, and physical activity readiness to assess any medical conditions prior to becoming a member.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>7. Payment Methods</Typography>
    <Typography variant="body2" paragraph>
      You can make payments through the app using Mastercard, VISA, BDO, Maya, or in person by visiting PSP Fitness Gym Taguig Jr.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>8. Equipment Reservation</Typography>
    <Typography variant="body2" paragraph>
      There are no reservations for gym equipment. All equipment is used on a first-come, first-served basis.
    </Typography>

    <Typography variant="subtitle1" gutterBottom>9. Facility Visits</Typography>
    <Typography variant="body2" paragraph>
      Whether you're a member or not, you are welcome to visit the PSP Fitness Gym Taguig Jr. to see the gym facility for yourself.
    </Typography>

    <Typography variant="body2" paragraph sx={{ mt: 2 }}>
      These terms are subject to change at any time without prior notice.
    </Typography>
  </>
);

export default Terms;
