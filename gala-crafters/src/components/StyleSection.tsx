import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import './StyleSection.css';

interface StyleSectionProps {
  title: string;
  description: string;
  images: string[];
  layoutType: 'style1' | 'style2';
}

const revealVariants: Variants = {
  hidden: { width: "100%" },
  visible: { width: "0%", transition: { duration: 1, ease: [0.65, 0, 0.35, 1] } }
};

const imageVariants: Variants = {
  hidden: { scale: 1.15 },
  visible: { scale: 1, transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } }
};

const textVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const StyleSection: React.FC<StyleSectionProps> = ({ title, description, images, layoutType }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (layoutType === 'style1') {
    return (
      <div className="style-section style-1-editorial" ref={ref}>
        {/* Texts overlap the tall image in the center slightly */}
        <motion.div 
           className="editorial-text-box style-1-text"
           initial="hidden"
           animate={isInView ? "visible" : "hidden"}
           variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.h3 variants={textVariants}>{title}</motion.h3>
          <motion.p variants={textVariants}>{description}</motion.p>
        </motion.div>

        <div className="style-1-images">
           {images.map((img, i) => (
              <div key={i} className={`img-wrapper img-${i + 1}`}>
                 <motion.img 
                   src={img} 
                   alt={`Style detail ${i + 1}`}
                   variants={imageVariants}
                   initial="hidden"
                   animate={isInView ? "visible" : "hidden"}
                 />
                 <motion.div 
                   className="reveal-mask" 
                   variants={revealVariants}
                   initial="hidden"
                   animate={isInView ? "visible" : "hidden"}
                 />
              </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="style-section style-2-editorial" ref={ref}>
       <div className="style-2-images">
           {images.map((img, i) => (
              <div key={i} className={`img-wrapper img-${i + 1}`}>
                 <motion.img 
                   src={img} 
                   alt={`Style detail ${i + 1}`}
                   variants={imageVariants}
                   initial="hidden"
                   animate={isInView ? "visible" : "hidden"}
                 />
                 <motion.div 
                   className="reveal-mask" 
                   variants={revealVariants}
                   initial="hidden"
                   animate={isInView ? "visible" : "hidden"}
                 />
              </div>
           ))}
       </div>
       <motion.div 
         className="editorial-text-box style-2-text"
         initial="hidden"
         animate={isInView ? "visible" : "hidden"}
         variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
       >
         <motion.h3 variants={textVariants}>{title}</motion.h3>
         <motion.p variants={textVariants}>{description}</motion.p>
       </motion.div>
    </div>
  );
};

export default StyleSection;
