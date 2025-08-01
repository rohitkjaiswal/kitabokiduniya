import React from 'react';
import { Link } from 'react-router-dom';
import fictionalImg from '../assets/fictionalpage.webp';
import nonFictionalImg from '../assets/nonFiction.webp';
import kabirSahab from '../assets/writers/kabir-sahab.webp';
import premchand from '../assets/writers/premchand.jpeg';
import styles from './PreHome.module.css';

function PreHome() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h3>📚 Books: the only friends who don’t judge your weird search history 😅</h3>
                </div>

                <div className={styles.section}>
                    <h1>
                        🎯 Choose your adventure! 👉{' '}
                        <Link to="/genre">Pick a Genre</Link>
                    </h1>
                    <p>🔍 Whether you're into flying broomsticks or business hacks — we've got your back.</p>
                    <div className={styles.sectionImages}>
                        <Link to="/genre/fiction">
                            <img
                                src={fictionalImg}
                                alt="Enter the land of imagination – Fiction"
                                className={styles.image}
                                title="Click for dragons, time travel & heartbreak!"
                            />
                        </Link>
                        <Link to="/genre/non-fiction">
                            <img
                                src={nonFictionalImg}
                                alt="Fuel your brain – Non-Fiction"
                                className={styles.image}
                                title="Click for wisdom, facts & TED-talk vibes!"
                            />
                        </Link>
                    </div>
                    <p>🎈 Fiction for the dreamers. Non-fiction for the thinkers. Or both for the overachievers 😉</p>
                </div>

                <div className={styles.section}>
                    <h1>
                        🖋️ Meet the Legends 👉{' '}
                        <Link to="/author">Choose an Author</Link>
                    </h1>
                    <p>🧐 Want to vibe with a mystic poet or a realist with 100 plot twists?</p>
                    <div className={styles.sectionImages}>
                        <Link to="/author/Kabir-Sahab">
                            <img
                                src={kabirSahab}
                                alt="Kabir Sahab – Mystic vibes only"
                                className={styles.image}
                                title="Click to decode the universe with poetry"
                            />
                        </Link>
                        <Link to="/author/Premchandra">
                            <img
                                src={premchand}
                                alt="Premchand – Master of Desi drama"
                                className={styles.image}
                                title="Click for heartbreak, revolution, and chai-worthy plots"
                            />
                        </Link>
                    </div>
                    <p>From ancient wisdom to epic storytelling — we've got the word wizards 🌟</p>
                </div>
            </div>

            <div className={styles.footer}>
                <h1>🚀 Welcome to Kitabo ki Duniya (aka Kitta Behai!)</h1>
                <p>📖 Your one-stop shop for bookish happiness, dramatic plots, and existential crises.</p>
                <p>🧠 Come for the books. Stay for the characters who make better life choices than us.</p>
                <p>💬 Not sure where to start? <Link to="/genre">Try a random genre</Link>, you rebel!</p>
                <p>
                    Wanna know who’s behind the scenes? Visit our mysterious{' '}
                    <Link to="/about">About Us</Link> page.
                </p>
            </div>
        </>
    );
}

export default PreHome;
