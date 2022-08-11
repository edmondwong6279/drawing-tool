import styles from './LoadingComponent.module.scss';
import React from 'react';
import { motion } from 'framer';

const LoadingComponent = () => (
	<div className={styles.loadingContainer}>
		<motion.div
			className={styles.loadingText}
			animate={{ opacity: [0.25, 1, 0.25] }}
			transition={{ repeat: Infinity, duration: 1.5 }}
		>
			Loading canvas...
		</motion.div>
	</div>
);
export default LoadingComponent;
