/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import styles from './MoreCanvasComponent.module.scss';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export type MoreCanvasComponentProps = {
	setLoading: Dispatch<SetStateAction<boolean>>;
};

const MoreCanvasComponent: React.ComponentType<MoreCanvasComponentProps> = ({ setLoading }) => {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [draw, setDraw] = useState(false);
	const [prevXY, setPrevXY] = useState([0, 0]);
	const [currXY, setCurrXY] = useState([0, 0]);

	// returns a new hex string for the strobey colours
	function generateColor() {
		const hexSet = '0123456789ABCDEF';
		let finalHexString = '#';
		for (let i = 0; i < 6; i++) {
			finalHexString += hexSet[Math.ceil(Math.random() * 15)];
		}
		return finalHexString;
	}

	// set up, only called once
	useEffect(() => {
		setLoading(false);
		if (canvas.current !== null) {
			canvas.current.width = 1000;
			canvas.current.height = 1000;
			setCtx(canvas.current.getContext('2d'));
		}
	}, []);

	useEffect(() => {
		if (ctx !== null && canvas.current !== null) {
			const dpr = window.devicePixelRatio;
			const rect = canvas.current.getBoundingClientRect();
			canvas.current.width = rect.width * dpr;
			canvas.current.height = rect.height * dpr;
			// Scale the context to ensure correct drawing operations
			canvas.current.style.width = `${rect.width}px`;
			canvas.current.style.height = `${rect.height}px`;
			ctx.scale(dpr, dpr); //not sure how to stop it from complaining...
			ctx.strokeStyle = generateColor();
			ctx.lineWidth = Math.round(Math.random() * 300 + 20);
		}
	}, [ctx]);

	// everytime the cursor moves, update the relevant state to only move cursor
	const drawMethod = (e: any) => {
		setPrevXY(currXY);
		setCurrXY([e.clientX, e.clientY]);
		if (ctx !== null && ctx !== undefined && draw) {
			ctx.lineCap = 'round';
			ctx.moveTo(prevXY[0], prevXY[1]);
			ctx.lineTo(currXY[0], currXY[1]);
			ctx.stroke();
		}
	};

	const handleMouseDown = (e: any) => {
		setDraw(true);
		if (ctx !== null) {
			ctx.beginPath(); // starts a fresh one
			// draw even if the mouse doesn't move
			ctx.lineCap = 'round';
			ctx.moveTo(prevXY[0], prevXY[1]);
			ctx.lineTo(currXY[0], currXY[1]);
			ctx.stroke();
		}
	};

	const handleMouseUp = (_e: any) => {
		setDraw(false);
		if (ctx !== null) {
			ctx.closePath();
			ctx.strokeStyle = generateColor();
			ctx.lineWidth = Math.round(Math.random() * 300 + 20);
		}
	};

	return (
		<div className={styles.container}>
			<canvas
				ref={canvas}
				className={styles.canvas}
				onMouseMove={drawMethod}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			/>
		</div>
	);
};

export default MoreCanvasComponent;
