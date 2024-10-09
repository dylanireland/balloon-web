import nftStyles from "../NFT.module.css";
import styles from "./Roadmap.module.css";

import Image from "next/image";

export default function Roadmap() {
	return (
		<div id={styles.roadmap}>
			<div>
				<div className={styles.left}>
					<Image
						src="/images/roadmap.svg"
						alt="Roadmap Balloon"
						width={0}
						height={0}
					/>
				</div>
				<div className={styles.right}>
					<h1>Roadmap</h1>
					<div className={styles.milestone}>
						<h4>Live on Sepolia Testnet</h4>
						<p>
							Balloon is live on the Sepolia testnet and lending and borrowing
							is enabled. Visit the app <a href="dapp">here</a> to test out the
							platform.
						</p>
					</div>
					<div className={styles.milestone}>
						<h4>Enable ERC-20 Collateralization</h4>
						<p>
							In a future version, Balloon will support the use of ERC-20 tokens
							as collateral and for interest payments. Currently, only ETH is
							permitted to be used.
						</p>
					</div>
					<div className={styles.milestone}>
						<h4>Security Audit</h4>
						<p>
							Before its release on the Ethereum mainnet, Balloon will receive a
							security audit from a reputed institution. Once we make our
							contract(s) public, we intend to host bug bounties for developers.
						</p>
					</div>
					<div className={styles.milestone}>
						<h4>Mainnet Release</h4>
						<p>
							Balloon will soon be released on the Ethereum mainnet and will
							interact with live NFTs.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
