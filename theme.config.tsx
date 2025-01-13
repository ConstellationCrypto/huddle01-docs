import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import Image from "next/image";
import image_src from './images/logo.svg'

const config: DocsThemeConfig = {
  logo: (
    <Image src={image_src} alt={""} width={50}/>
  ),
  nextThemes: { defaultTheme: "light", forcedTheme: "light" },
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Huddle01 Docs",
    };
  },
  navigation: false,
};

export default config;
