import React from 'react';
import { motion } from 'framer-motion';

function Robot() {
  return (
    <div className="App">
      <motion.div
        className="character"
        animate={{ x: 100 }} // Move the entire character across the screen
        transition={{ duration: 5, ease: "linear" }} // Adjust walking duration
        style={{ position: 'relative' }}
      >
        {/* Character Body */}
        <div className="body">
          <img src="/images/body.png" alt="Body" />
        </div>

        {/* Left Arm */}
        <motion.div
          className="left-arm"
          animate={{
            rotate: [5, -10, 5], // Swing arm between 10 degrees and -30 degrees
          }}
          transition={{
            duration: 0.5, // Duration of each swing
            repeat: Infinity, // Repeat the animation indefinitely
            repeatType: "mirror", // Mirror the animation to swing back and forth
          }}
          style={{ position: 'absolute', top: '55px', left: '-3px' }}
        >
          <img src="images/robot_left.png" alt="Left Arm" />
        </motion.div>

        {/* Right Arm */}
        <motion.div
          className="right-arm"
          animate={{
            rotate: [-5, 10, -5], // Swing arm between -10 degrees and 30 degrees
          }}
          transition={{
            duration: 0.5, // Duration of each swing
            repeat: Infinity, // Repeat the animation indefinitely
            repeatType: "mirror", // Mirror the animation to swing back and forth
          }}
          style={{ position: 'absolute', top: '55px', right: '1410px' }}
        >
          <img src="images/robot_right_arm.png" alt="Right Arm" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Robot;
