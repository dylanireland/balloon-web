import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
	return (
		<div id={styles.navbar}>
			<Image
				className={styles.navLogo}
				src="/images/fulllogotestnet.svg"
				width={200}
				height={0}
				alt={"Full logo"}
			/>
			<div className="navLinks">
				<a href="dapp" className={`${styles.navitem} ${styles.navstar}`}>
					Launch dApp
				</a>
			</div>
		</div>
	);
}
