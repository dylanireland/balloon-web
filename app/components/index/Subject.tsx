"use client";
import styles from "./Subject.module.css";
import Image from "next/image";
import { useRef, createRef, useEffect } from "react";

export default function Subject() {
	const background = useRef(null);

	useEffect(() => {
		let body = document.querySelector("body");
		if (body != null && background != null && background.current != null) {
			parallax(body, background.current);
		}
	}, []);

	function parallax(body: HTMLBodyElement, bg: HTMLElement) {
		body.onscroll = function paraScroll() {
			let scrollingElement = document.scrollingElement;
			if (!scrollingElement) {
				return;
			}

			var scrolltotop: number = scrollingElement.scrollTop;
			var xvalue = "left top";
			var factor = 0.5;
			var yvalue = scrolltotop * factor;
			bg.style.backgroundPosition = xvalue + " " + yvalue + "px";
		};
	}

	return (
		<div id={styles.subject}>
			<div id={styles.background} ref={background}></div>
			<div className={styles.content}>
				<div id={styles.infoContainer}>
					<button id="learnmore" className={styles.showoffButton}>
						{" "}
						{/* Probably only id'd for event listeners */}
						Learn More
					</button>
					<button id="dappLauncher" className={styles.showoffButton}>
						Launch dApp
					</button>
					<div className={styles.socials}>
						<Image
							className={styles.logo}
							src={"/images/twitter_pink.svg"}
							alt={"X Logo"}
							width={100}
							height={100}
						/>
						<Image
							className={styles.logo}
							src={"/images/discord_pink.svg"}
							alt={"Discord Logo"}
							width={100}
							height={100}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
