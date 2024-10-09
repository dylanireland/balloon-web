import nftStyles from "../NFT.module.css";
import styles from "./EasyTopic.module.css";

import Image from "next/image";

export default function EasyTopic() {
	return (
		<>
			<div id={styles.lending} className={styles.topic}>
				<h1>Lending</h1>
				<div>
					<div className={styles.left}>
						<h1>Limited Risk,</h1>
						<h1>Attractive Returns.</h1>
						<p>
							Specify your NFT's valuation and a collateral multiplier to ensure
							borrowers are overcollateralized to your standards. If a borrower
							does not repay a loan, you will have the opportunity to seize all
							of their collateral after the loan's expiration date.
						</p>
					</div>
					<div className={styles.right}>
						<div id={styles.floatingETHContainer}>
							<Image
								src={"/images/floatingeth.svg"}
								alt={"Bouyant ETH logo"}
								layout="responsive"
								width={500}
								height={0}
							/>
						</div>
					</div>
				</div>
			</div>
			<div id={styles.borrowing} className={styles.topic}>
				<h1>Borrowing</h1>
				<div>
					<div className={styles.left}>
						<div className={`${nftStyles.nftElement} ${styles.nftElement}`}>
							<div>
								<Image
									className={nftStyles.nftImage}
									src={
										"https://lh3.googleusercontent.com/0gdZ45HaU-bK930OyA9Lu5g5YpQ1Yady6vpd441zbjUBELN4hzI8FeIY99MItiVJXw1-l3o210uu67sTM9nkGiG8"
									}
									alt={"Topic Image"}
									layout="responsive"
									width={500}
									height={0}
								/>
							</div>
							<div className={nftStyles.nftDescriptionContainer}>
								<div className={nftStyles.nftPriceContainer}>
									<Image
										className={nftStyles.nftPriceETHLogo}
										src={"/images/ethlogo.svg"}
										alt={"Ethereum Logo"}
										layout="responsive"
										width={0}
										height={0}
									/>
									<h4 className={nftStyles.priceLabel}>120</h4>
									<h3 className={nftStyles.collateralLabel}>@ 2x</h3>
									<h4 className={nftStyles.nftTokenId}>#6089</h4>
								</div>
								<div className={nftStyles.nftCollectionContainer}>
									<h4 className={nftStyles.nftCollectionName}>CryptoPunks</h4>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.right}>
						<h1>Borrow on your own terms.</h1>
						<p>
							When borrowing, you may choose the NFT with the most optimal
							valuation, collateral requirement, and loan duration for your
							circumstances. Upon repayment, you will only pay interest
							proportional to the time elapsed relative to the loan duration;
							you will only need to worry about liquidation if you do not repay
							your loan before the end date. In the event that you are
							liquidated, you will forfeit all of your collateral to the lender
							but will remain the owner of the NFT.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
