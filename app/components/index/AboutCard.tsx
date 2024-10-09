import styles from "./AboutCard.module.css";
import Image from "next/image";
import { useEffect } from "react";
import { Tilt } from "react-tilt";

export enum CardType {
	Lending,
	Borrowing,
	Shorting
}

type AboutCardProps = {
	cardType: CardType;
};

export default function AboutCard({ cardType }: AboutCardProps) {
	const type = getAppropriateCard(cardType);

	return (
		<Tilt
			options={{ scale: 1, glare: true, maxGlare: 0.3 }}
			className={`${styles.column} ${styles.tile} js-tilt`}
		>
			<div className={styles.inner}>
				<div className={styles.imgContainer}>
					<Image
						className={styles.image}
						src={`/images/${type}.svg`}
						alt={`${type} symbol`}
						height={100}
						width={100}
					/>
				</div>
				<div className={styles.aboutTextHolder}>
					<h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
					<p>
						Balloon makes it easy to earn passive returns on your NFTs. Simply
						deposit a floor-priced NFT of your choosing, specificy a few
						parameters, and earn interest on your NFTs! <a>Read More</a>
					</p>
				</div>
			</div>
		</Tilt>
	);

	function getAppropriateCard(cardType: CardType): string {
		switch (cardType) {
			case CardType.Lending:
				return "lending";
			case CardType.Borrowing:
				return "borrow";
			case CardType.Shorting:
				return "short";
			default:
				return "";
		}
	}
}
