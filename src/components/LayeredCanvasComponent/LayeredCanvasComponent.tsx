/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import styles from './LayeredCanvasComponent.module.scss';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
// import anime from 'animejs';

export type LayeredCanvasComponentProps = {
	setLoading: Dispatch<SetStateAction<boolean>>;
};

const LayeredCanvasComponent: React.ComponentType<LayeredCanvasComponentProps> = ({
	setLoading,
}) => {
	const canvasCursor = useRef<HTMLCanvasElement | null>(null);
	const [ctxCursor, setCtxCursor] = useState<CanvasRenderingContext2D | null>(null);
	const canvasDrawing = useRef<HTMLCanvasElement | null>(null);
	const [ctxDrawing, setCtxDrawing] = useState<CanvasRenderingContext2D | null>(null);
	const [draw, setDraw] = useState(false);
	const [prevXY, setPrevXY] = useState([0, 0]);
	const [currXY, setCurrXY] = useState([0, 0]);
	const [brushConfig, setBrushConfig] = useState<[string, number]>([
		generateColor(),
		Math.round(Math.random() * 300 + 20),
	]);
	const [offsetLeft, setOffsetLeft] = useState(0);
	const [offsetTop, setOffsetTop] = useState(0);
	const dimension = 1000;

	// anime({
	// 	targets: brushConfig,
	// 	round: 1,
	// 	easing: 'linear',
	// 	update: () => {
	// 		console.log(brushConfig);
	// 	},
	// });

	// returns a new hex string for the strobey colours
	function generateColor() {
		const hexSet = '0123456789ABCDEF';
		let finalHexString = '#';
		for (let i = 0; i < 6; i++) {
			finalHexString += hexSet[Math.ceil(Math.random() * 15)];
		}
		return finalHexString;
	}

	function drawMouse(color: string, width: number) {
		if (ctxCursor !== null) {
			ctxCursor.clearRect(0, 0, dimension, dimension);

			// the brush
			ctxCursor.fillStyle = color;
			ctxCursor.beginPath();
			ctxCursor.arc(currXY[0] - offsetLeft, currXY[1] - offsetTop, width / 2, 0, Math.PI * 2);
			ctxCursor.fill();

			// the dot
			ctxCursor.fillStyle = '#000000';
			ctxCursor.beginPath();
			ctxCursor.arc(currXY[0] - offsetLeft, currXY[1] - offsetTop, 4, 0, Math.PI * 2);
			ctxCursor.fill();
		}
	}

	// set up, only called once
	useEffect(() => {
		if (canvasDrawing.current !== null && canvasCursor.current !== null) {
			canvasDrawing.current.width = dimension;
			canvasDrawing.current.height = dimension;
			canvasCursor.current.width = dimension;
			canvasCursor.current.height = dimension;
			setCtxDrawing(canvasDrawing.current.getContext('2d'));
			setCtxCursor(canvasCursor.current.getContext('2d'));
			setOffsetLeft(canvasDrawing.current?.offsetLeft);
			setOffsetTop(canvasDrawing.current?.offsetTop);
		}
	}, []);

	// set up once ctx has been set
	useEffect(() => {
		if (
			ctxCursor !== null &&
			canvasCursor.current !== null &&
			ctxDrawing !== null &&
			canvasDrawing.current !== null
		) {
			const dpr = window.devicePixelRatio;
			const rect = canvasCursor.current.getBoundingClientRect();
			canvasCursor.current.width = rect.width * dpr;
			canvasCursor.current.height = rect.height * dpr;
			canvasDrawing.current.width = rect.width * dpr;
			canvasDrawing.current.height = rect.height * dpr;
			// Scale the context (both) to ensure correct drawing operations
			canvasCursor.current.style.width = `${rect.width}px`;
			canvasCursor.current.style.height = `${rect.height}px`;
			canvasDrawing.current.style.width = `${rect.width}px`;
			canvasDrawing.current.style.height = `${rect.height}px`;
			ctxCursor.scale(dpr, dpr);
			ctxDrawing.scale(dpr, dpr);
			// [ctxCursor.strokeStyle, ctxCursor.lineWidth] = brushConfig;
			[ctxDrawing.strokeStyle, ctxDrawing.lineWidth] = brushConfig;
			drawMouse(...brushConfig);
			setLoading(false);
		}
	}, [ctxDrawing, ctxCursor]);

	// everytime the cursor moves, update the relevant state to only move cursor
	const handleMouseMove = (e: any) => {
		setPrevXY(currXY);
		setCurrXY([e.clientX, e.clientY]);
		if (
			ctxDrawing !== null &&
			ctxDrawing !== undefined &&
			ctxCursor !== null &&
			ctxCursor !== undefined
		) {
			// ctx.translate(currXY[0], currXY[1]);
			if (draw) {
				ctxDrawing.beginPath();
				ctxDrawing.lineCap = 'round';
				ctxDrawing.moveTo(prevXY[0] - offsetLeft, prevXY[1] - offsetTop);
				ctxDrawing.lineTo(currXY[0] - offsetLeft, currXY[1] - offsetTop);
				ctxDrawing.stroke();
			}
			drawMouse(...brushConfig);
		}
	};

	const handleMouseDown = (_e: any) => {
		setDraw(true);
		// draw even if there's just a mouse down
		if (
			ctxDrawing !== null &&
			ctxDrawing !== undefined &&
			ctxCursor !== null &&
			ctxCursor !== undefined
		) {
			[ctxDrawing.strokeStyle, ctxDrawing.lineWidth] = brushConfig;
			ctxDrawing.beginPath();
			ctxDrawing.lineCap = 'round';
			ctxDrawing.moveTo(currXY[0] - offsetLeft, currXY[1] - offsetTop);
			ctxDrawing.lineTo(currXY[0] - offsetLeft, currXY[1] - offsetTop);
			ctxDrawing.stroke();
		}
	};

	const handleMouseUp = (_e: any) => {
		setDraw(false);
		if (ctxCursor !== null) {
			// transition between old config to new
			const [color, width] = [generateColor(), Math.round(Math.random() * 200 + 20)];
			setBrushConfig([color, width]);
			drawMouse(color, width);
		}
	};

	// const requestRef = useRef();
	// const previousTimeRef = useRef();

	// const animate = (time: number) => {
	// 	// Change the state according to the animation
	// 	if (previousTimeRef.current != undefined) {
	// 		const deltaTime = time - previousTimeRef.current;

	// 		// Pass on a function to the setter of the state
	// 		// to make sure we always have the latest state
	// 		setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100);
	// 	}
	// 	previousTimeRef.current = time;
	// 	requestRef.current = requestAnimationFrame(animate);
	// };

	// useEffect(() => {
	// 	requestRef.current = requestAnimationFrame(animate);
	// 	return () => cancelAnimationFrame(requestRef.current);
	// }, []); // Make sure the effect runs only once

	return (
		<div className={styles.container}>
			<canvas ref={canvasCursor} className={styles.cursor} />
			<canvas
				ref={canvasDrawing}
				className={styles.drawing}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			/>
		</div>
	);
};

export default LayeredCanvasComponent;
