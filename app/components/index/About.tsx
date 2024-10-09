"use client";
import styles from "./About.module.css";
import AboutCard from "./AboutCard";
import { CardType } from "./AboutCard";

export default function About() {
	return (
		<div id={styles.about}>
			<h1>What can you do?</h1>
			<div className={styles.row}>
				<AboutCard cardType={CardType.Lending} />
				<AboutCard cardType={CardType.Borrowing} />
				<AboutCard cardType={CardType.Shorting} />
			</div>
		</div>
	);
}
