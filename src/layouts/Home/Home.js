import gamestackTexture2Large from 'assets/gamestack-list-large.jpg';
import gamestackTexture2Placeholder from 'assets/gamestack-list-placeholder.jpg';
import gamestackTexture2 from 'assets/gamestack-list.jpg';
import gamestackTextureLarge from 'assets/gamestack-login-large.jpg';
import gamestackTexturePlaceholder from 'assets/gamestack-login-placeholder.jpg';
import gamestackTexture from 'assets/gamestack-login.jpg';
import sliceTextureLarge from 'assets/pic1.png';
import sliceTexturePlaceholder from 'assets/pic1.png';
import sliceTexture from 'assets/pic1.png';
import sprTextureLarge from 'assets/myblog.jpg';
import sprTexturePlaceholder from 'assets/myblog.jpg';
import sprTexture from 'assets/myblog.jpg';
import volkiharTextureLarge from 'assets/volkihar-banner-large.jpg';
import volkiharTexturePlaceholder from 'assets/volkihar-banner-placeholder.jpg';
import volkiharTexture from 'assets/volkihar-banner.jpg';
import { Footer } from 'components/Footer';
import { Meta } from 'components/Meta';
import { Intro } from 'layouts/Home/Intro';
import { Profile } from 'layouts/Home/Profile';
import { ProjectSummary } from 'layouts/Home/ProjectSummary';
import { useEffect, useRef, useState } from 'react';
import pic3 from '../../assets/pic3.png';
import styles from './Home.module.css';
import ChatbotIframe from 'layouts/ChatbotIframe';

const disciplines = ['Backend', 'DevOps', 'Frontend'];

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef(null);
  const projectOne = useRef(null);
  const projectTwo = useRef(null);
  const projectThree = useRef(null);
  const projectFour = useRef(null);
  const details = useRef(null);

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, projectFour, details].filter(Boolean);

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      if (section.current) {
        sectionObserver.observe(section.current);
      }
    });

    if (intro.current) {
      indicatorObserver.observe(intro.current);
    }

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Meta title="Developer" description="A Passionate developer." />
      <Intro
        id="intro"
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Instagram Automation"
        description="This website offers Instagram API integration, AI-powered DM automations, keyword-based triggers, story replies, a seamless dashboard, payment plans, and webhooks, optimizing customer outreach and automating high-ticket sales processes."
        buttonText="View project"
        buttonLink="/projects/my-blog"
        model={{
          type: 'laptop',
          alt: 'Smart Sparrow lesson builder',
          textures: [
            {
              srcSet: [pic3, pic3],
              placeholder: sprTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Video game progress tracking"
        description="Design and development for a video game tracking app built in React Native"
        buttonText="View website"
        buttonLink="mishra19.netlify.app/siddhammihsra"
        model={{
          type: 'phone',
          alt: 'App login screen',
          textures: [
            {
              srcSet: [gamestackTexture, gamestackTextureLarge],
              placeholder: gamestackTexturePlaceholder,
            },
            {
              srcSet: [gamestackTexture2, gamestackTexture2Large],
              placeholder: gamestackTexture2Placeholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title=" Automate"
        description="This B2C SaaS integrates Google Drive, Slack, Discord, Notion, and Stripe with custom-built connections, offering automation flows, a node-based drag-and-drop builder, infinite canvas, and stunning UI with light/dark modes."
        buttonLink="/projects/slice"
        buttonText="View project"
        model={{
          type: 'laptop',
          alt: 'Showing my website',
          textures: [
            {
              srcSet: [sliceTexture, sliceTextureLarge],
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-4"
        alternate
        sectionRef={projectFour}
        visible={visibleSections.includes(projectFour.current)}
        index={4}
        title="AI Marketing"
        description="This Next.js 15 project features an AI chatbot for automated sales, real-time chat, secure file uploads, SEO-optimized blogging, and email marketing, offering seamless user engagement and lead generation."
        buttonText="View project"
        buttonLink="/projects/volkihar-knight"
        model={{
          type: 'laptop',
          alt: 'Volkihar Knight armor mod',
          textures: [
            {
              srcSet: [volkiharTexture, volkiharTextureLarge],
              placeholder: volkiharTexturePlaceholder,
            },
          ],
        }}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
      <ChatbotIframe />
    </div>
  );
};
