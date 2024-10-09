import styles from "./FAQ.module.css";

export default function FAQ() {
	return (
		<div id={styles.faq}>
			<h1>FAQ</h1>
			<div className={`${styles.qa} ${styles.question}`}>
				<div className={styles.left}>
					<h1>Q</h1>
				</div>
				<div className={styles.right}>
					<h3>How am I able to bet against NFTs using Balloon?</h3>
				</div>
			</div>
			<div className={`${styles.qa} ${styles.answer}`}>
				<div className={styles.left}>
					<h1>A</h1>
				</div>
				<div className={styles.right}>
					<h3>
						By borrowing an NFT, selling it on the open market, waiting for the
						floor-price of the collection to drop, buying the same or different
						NFT back and returning it, you can effectively short an NFT
						collection.
					</h3>
				</div>
			</div>
			<div className={`${styles.qa} ${styles.question}`}>
				<div className={styles.left}>
					<h1>Q</h1>
				</div>
				<div className={styles.right}>
					<h3>Why don't I see the NFTs I've deposited?</h3>
				</div>
			</div>
			<div className={`${styles.qa} ${styles.answer}`}>
				<div className={styles.left}>
					<h1>A</h1>
				</div>
				<div className={styles.right}>
					<h3>
						We often update our smart contract to include new features. Once
						Balloon is deployed to the Ethereum mainnet you will not encounter
						this issue.
					</h3>
				</div>
			</div>
		</div>
	);
}
