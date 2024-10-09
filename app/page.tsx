import Image from "next/image";
import styles from "./page.module.css";
import Subject from "./components/index/Subject";
import About from "./components/index/About";
import EasyTopic from "./components/index/EasyTopic";
import Roadmap from "./components/index/Roadmap";
import FAQ from "./components/index/FAQ";

export default function Home() {
	return (
		<div id={styles.home}>
			<Subject />
			<About />
			<EasyTopic />
			<Roadmap />
			<FAQ />
		</div>
	);
}
