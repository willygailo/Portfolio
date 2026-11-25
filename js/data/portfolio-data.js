(function () {
  "use strict";

  function deepFreeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value);
      Object.keys(value).forEach(function (key) {
        deepFreeze(value[key]);
      });
    }
    return value;
  }

  var portfolioData = {
    profile: {
      name: "Willy Jr Carnasa Gailo",
      handle: "@willygailo",
      alias: "PENTESTER willygailo",
      tagline: "Android Systems · Pentester · Tool Builder",
      bio: "Aspiring developer focused on building practical tools and Android projects. learning and improving.",
      githubUrl: "https://github.com/willygailo",
      facebookUrl: "https://web.facebook.com/https.willy.jr.carnasa.gailo2026.2027",
      avatarPath: "assets/images/avatar.svg",
      stats: [
        { label: "Public Repos", value: "6+", hint: "Android, Sec & Web" },
        { label: "Core Stack", value: "C++ / Py", hint: "NDK, Kotlin, Java" },
        { label: "Target OS", value: "Android", hint: "Shizuku & Kali Linux" },
        { label: "Focus", value: "AppSec", hint: "Perf & Rev-Eng" }
      ]
    },

    projects: [
      {
        id: "game-launcher",
        name: "Game-Launcher",
        title: "Game-Launcher",
        category: "android",
        categoryLabel: "Android",
        tech: ["Java", "C++", "Shizuku", "Vulkan"],
        repoUrl: "https://github.com/willygailo/Game-Launcher",
        featured: true,
        summary: "Android 14-16 gaming performance engine with non-root Shizuku AIDL privilege containment, refresh-rate locking, CPU/GPU tuning, and privacy-first local processing.",
        highlights: [
          "Non-root Shizuku AIDL privilege containment tailored for Android 14-16",
          "Refresh-rate locking paired with CPU/GPU performance tuning",
          "Java and C++ native integration with Vulkan pipeline awareness",
          "Privacy-first local processing with zero external telemetry"
        ]
      },
      {
        id: "android-libtool-new",
        name: "Android-LibTool-New",
        title: "Android-LibTool-New",
        category: "android",
        categoryLabel: "Android / NDK",
        tech: ["C++17", "Android NDK", "Shizuku", "UnityFS"],
        repoUrl: "https://github.com/willygailo/Android-LibTool-New",
        featured: true,
        summary: "Dual-layer Android modding and reverse-engineering toolkit with native libTool.so engine, non-root UnityFS patching, IL2CPP API inspection, and Hex/String viewer.",
        highlights: [
          "Dual-layer architecture powered by a native C++17 libTool.so engine",
          "Non-root UnityFS patching orchestrated through Shizuku",
          "IL2CPP API inspection for Android reverse-engineering workflows",
          "Integrated Hex and String viewer for direct binary inspection"
        ]
      },
      {
        id: "open-penetration",
        name: "Open_Penetration",
        title: "Open_Penetration",
        category: "security",
        categoryLabel: "Security",
        tech: ["Python", "Kali Linux", "CLI"],
        repoUrl: "https://github.com/willygailo/Open_Penetration",
        featured: true,
        summary: "Practical penetration-testing and security assessment automation toolkit written in Python.",
        highlights: [
          "Python-powered CLI automation for repeatable security assessments",
          "Built for Kali Linux and terminal-first pentesting workflows",
          "Modular utility design focused on practical field execution"
        ]
      },
      {
        id: "ai-ko",
        name: "AI-ko",
        title: "AI-ko",
        category: "security",
        categoryLabel: "AI Security",
        tech: ["Python", "Web/API", "Security"],
        repoUrl: "https://github.com/willygailo/AI-ko",
        featured: false,
        summary: "Private, provider-agnostic AI web and API penetration-testing platform.",
        highlights: [
          "Provider-agnostic AI workflow supporting flexible model backends",
          "Focused on web application and API penetration testing",
          "Privacy-first design keeping assessment workflows self-contained"
        ]
      },
      {
        id: "beta-manager",
        name: "BETA-MANAGER",
        title: "BETA-MANAGER",
        category: "android",
        categoryLabel: "Android",
        tech: ["Kotlin", "Android Studio"],
        repoUrl: "https://github.com/willygailo/BETA-MANAGER",
        featured: false,
        summary: "Kotlin-based Android utility for managing beta builds, configurations, and testing workflows.",
        highlights: [
          "Built in Kotlin using standard Android Studio project structure",
          "Organizes beta build tracking and configuration switching",
          "Streamlines iterative Android QA and testing workflows"
        ]
      },
      {
        id: "web-editor",
        name: "web-editor",
        title: "web-editor",
        category: "web",
        categoryLabel: "Web Tool",
        tech: ["TypeScript", "Browser", "Workspace"],
        repoUrl: "https://github.com/willygailo/web-editor",
        featured: false,
        summary: "Lightweight browser-based editor and developer workspace built with TypeScript.",
        highlights: [
          "Type-safe browser workspace engineered with TypeScript",
          "Lightweight editing flow running directly in the browser",
          "Practical developer utility with minimal setup overhead"
        ]
      }
    ],

    skills: [
      {
        id: "mobile-native",
        title: "Mobile & Native",
        icon: "smartphone",
        items: [
          "Android (14-16)",
          "Android NDK",
          "C++17",
          "Kotlin",
          "Java",
          "Shizuku AIDL",
          "Vulkan"
        ]
      },
      {
        id: "security-pentesting",
        title: "Security & Pentesting",
        icon: "shield",
        items: [
          "AppSec",
          "Reverse Engineering",
          "IL2CPP Inspection",
          "UnityFS Patching",
          "Web & API Pentesting",
          "Kali Linux",
          "Hex / String Analysis"
        ]
      },
      {
        id: "web-scripting",
        title: "Web & Scripting",
        icon: "code",
        items: [
          "Python",
          "TypeScript",
          "HTML5 / CSS3",
          "Browser Workspaces",
          "CLI Automation"
        ]
      },
      {
        id: "tooling-platforms",
        title: "Tooling & Platforms",
        icon: "terminal",
        items: [
          "Android Studio",
          "libTool.so Native Engine",
          "Git & GitHub",
          "Non-Root System Tooling",
          "Static Web / PWA"
        ]
      }
    ],

    socials: [
      {
        id: "github",
        label: "GitHub",
        handle: "@willygailo",
        description: "Source code, Android NDK engines, and security tools",
        url: "https://github.com/willygailo",
        icon: "github"
      },
      {
        id: "facebook",
        label: "Facebook",
        handle: "Willy Jr Carnasa Gailo",
        description: "Direct social profile and updates",
        url: "https://web.facebook.com/https.willy.jr.carnasa.gailo2026.2027",
        icon: "facebook"
      }
    ],

    terminalCommands: {
      help: {
        description: "List available terminal commands",
        lines: [
          "Available commands:",
          "  whoami   - Display developer & pentester profile",
          "  stack    - Print core languages, NDK, and security tooling",
          "  repos    - List 6 verified GitHub repositories",
          "  socials  - Show verified GitHub and Facebook links",
          "  clear    - Clear terminal output"
        ]
      },
      whoami: {
        description: "Display profile summary",
        lines: [
          "Name   : Willy Jr Carnasa Gailo (@willygailo)",
          "Alias  : PENTESTER willygailo",
          "Role   : Android Systems · Pentester · Tool Builder",
          "Bio    : Aspiring developer focused on building practical tools and Android projects. learning and improving."
        ]
      },
      stack: {
        description: "Show primary technical stack",
        lines: [
          "Mobile & Native : Android 14-16, NDK (C++17), Kotlin, Java, Shizuku AIDL, Vulkan",
          "Security        : AppSec, Rev-Eng, IL2CPP, UnityFS, Web/API Pentesting, Kali Linux",
          "Web & Scripting : Python, TypeScript, CLI Tooling, Browser Workspaces"
        ]
      },
      repos: {
        description: "List featured and public repositories",
        lines: [
          "[1] Game-Launcher       [Android]       Java · C++ · Shizuku · Vulkan",
          "[2] Android-LibTool-New [Android/NDK]   C++17 · NDK · Shizuku · UnityFS",
          "[3] Open_Penetration    [Security]      Python · Kali Linux · CLI",
          "[4] AI-ko               [AI Security]   Python · Web/API · Security",
          "[5] BETA-MANAGER        [Android]       Kotlin · Android Studio",
          "[6] web-editor          [Web Tool]      TypeScript · Browser · Workspace"
        ]
      },
      socials: {
        description: "Show verified external profiles",
        lines: [
          "GitHub   : https://github.com/willygailo",
          "Facebook : https://web.facebook.com/https.willy.jr.carnasa.gailo2026.2027"
        ]
      },
      clear: {
        description: "Clear terminal log",
        action: "clear",
        lines: []
      }
    }
  };

  window.PortfolioData = deepFreeze(portfolioData);
})();
