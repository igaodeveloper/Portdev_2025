export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const floatAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(107, 76, 255, 0.5)",
      "0 0 30px rgba(155, 48, 255, 0.8)",
      "0 0 20px rgba(107, 76, 255, 0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const particleFloat = {
  animate: {
    y: [0, -100],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const glitchEffect = {
  animate: {
    x: [0, -2, -2, 2, 2, 0],
    y: [0, 2, -2, 2, -2, 0],
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

export const cosmicRotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 50,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const cardHover = {
  whileHover: {
    y: -10,
    rotateX: 5,
    boxShadow: "0 20px 40px rgba(107, 76, 255, 0.3)",
    transition: { duration: 0.3 }
  }
};
