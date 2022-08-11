/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import styles from './CanvasComponent.module.scss';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

export type CanvasComponentProps = {
	setLoading: Dispatch<SetStateAction<boolean>>;
};

const CanvasComponent: React.ComponentType<CanvasComponentProps> = ({ setLoading }) => {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const particles: any[] = [];
	let ctx: CanvasRenderingContext2D | null;

	function generateColor() {
		const hexSet = '0123456789ABCDEF';
		let finalHexString = '#';
		for (let i = 0; i < 6; i++) {
			finalHexString += hexSet[Math.ceil(Math.random() * 15)];
		}
		return finalHexString;
	}

	class Particle {
		x: number;
		y: number;
		particleTrailWidth: number;
		strokeColor: string;
		rotateSpeed: number;
		theta: number;
		t: number;
		context: CanvasRenderingContext2D;

		constructor(
			x: number,
			y: number,
			particleTrailWidth: number,
			strokeColor: string,
			rotateSpeed: number,
			context: CanvasRenderingContext2D
		) {
			this.x = x;
			this.y = y;
			this.particleTrailWidth = particleTrailWidth;
			this.strokeColor = strokeColor;
			this.theta = Math.random() * Math.PI * 2;
			this.rotateSpeed = rotateSpeed;
			this.t = Math.random() * 150;

			this.context = context;
		}

		rotate = () => {
			const ls = {
				x: this.x,
				y: this.y,
			};
			this.theta += this.rotateSpeed;
			this.x = 200 + Math.cos(this.theta) * this.t;
			this.y = 200 + Math.sin(this.theta) * this.t;
			this.context.beginPath();
			this.context.lineWidth = this.particleTrailWidth;
			this.context.strokeStyle = this.strokeColor;
			this.context.moveTo(ls.x, ls.y);
			this.context.lineTo(this.x, this.y);
			this.context.stroke();
		};
	}

	const renderFrame = () => {
		if (ctx !== null) {
			ctx.clearRect(0, 0, 1000, 1000);
			ctx.fillStyle = 'rgba(0,0,0,0.05)';
			ctx.fillRect(0, 0, 1000, 1000);
		}

		particles.forEach((particle) => particle.rotate());
	};

	const tick = () => {
		requestAnimationFrame(tick);
		renderFrame();
	};

	useEffect(() => {
		console.log('use effect');
		setLoading(false);
		if (canvas.current !== null) {
			canvas.current.width = 1000;
			canvas.current.height = 1000;

			ctx = canvas.current.getContext('2d');
			if (ctx !== null) {
				ctx.globalAlpha = 0.5;

				for (let i = 0; i < 100; i++) {
					particles[i] = new Particle(200, 200, 4, generateColor(), 0.02, ctx);
				}
			}
		}
		tick();
	}, []);

	return (
		<div className={styles.container}>
			<canvas ref={canvas} className={styles.canvas} />
		</div>
	);
};

export default CanvasComponent;
