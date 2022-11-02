// This was our initial attempt but it gave very bad performance.
import styles from './SlowCanvasComponent.module.scss';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export type SlowCanvasComponentProps = {
	setLoading: Dispatch<SetStateAction<boolean>>;
};

const SlowCanvasComponent: React.ComponentType<SlowCanvasComponentProps> = ({ setLoading }) => {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [draw, setDraw] = useState(false);
	const [prevXY, setPrevXY] = useState([0, 0]);
	const [currXY, setCurrXY] = useState([0, 0]);
	const [brushConfig, setBrushConfig] = useState<[string, number]>([
		generateColor(),
		Math.round(Math.random() * 300 + 20),
	]);
	const [drawingState, setDrawingState] = useState<
		[number, number, number, number, string, number][]
	>([]);

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
	}, [setLoading]);

	// set up once ctx has been set
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
			[ctx.strokeStyle, ctx.lineWidth] = brushConfig;
			ctx.lineCap = 'round';
		}
	}, [brushConfig, ctx]);

	useEffect(() => {
		if (ctx !== null) {
			drawingState.map((current) => {
				ctx.beginPath();
				[, , , , ctx.strokeStyle, ctx.lineWidth] = current;
				ctx.moveTo(current[0], current[1]);
				ctx.lineTo(current[2], current[3]);
				ctx.stroke();
			});
		}
	}, [ctx, drawingState]);

	// everytime the cursor moves, update the relevant state to only move cursor
	const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
		setPrevXY(currXY);
		setCurrXY([e.clientX, e.clientY]);

		// try saving the current state, clear, draw the location of the brush again, then restore
		if (ctx !== null && ctx !== undefined) {
			ctx.clearRect(0, 0, 1000, 1000);
			drawingState.map((current) => {
				ctx.beginPath();
				[, , , , ctx.strokeStyle, ctx.lineWidth] = current;
				ctx.moveTo(current[0], current[1]);
				ctx.lineTo(current[2], current[3]);
				ctx.stroke();
			});
			ctx.beginPath();
			[ctx.strokeStyle, ctx.lineWidth] = brushConfig;
			ctx.moveTo(prevXY[0], prevXY[1]);
			ctx.lineTo(currXY[0], currXY[1]);
			ctx.stroke();
			if (draw) {
				setDrawingState([
					...drawingState,
					[prevXY[0], prevXY[1], currXY[0], currXY[1], brushConfig[0], brushConfig[1]],
				]);
			}
		}
	};

	const handleMouseDown = () => {
		setDraw(true);
		if (ctx !== null) {
			setDrawingState([
				...drawingState,
				[prevXY[0], prevXY[1], currXY[0], currXY[1], brushConfig[0], brushConfig[1]],
			]);
		}
	};

	const handleMouseUp = () => {
		setDraw(false);
		if (ctx !== null) {
			setBrushConfig([generateColor(), Math.round(Math.random() * 200 + 20)]);
		}
	};

	return (
		<div className={styles.container}>
			<canvas
				ref={canvas}
				className={styles.canvas}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			/>
		</div>
	);
};

export default SlowCanvasComponent;
