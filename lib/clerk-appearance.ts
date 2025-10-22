export const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorBackground: "hsl(var(--background))",
    colorInputBackground: "hsl(var(--background))",
    colorInputText: "hsl(var(--foreground))",
    colorText: "hsl(var(--foreground))",
    colorTextSecondary: "hsl(var(--muted-foreground))",
    colorTextOnPrimaryBackground: "hsl(var(--primary-foreground))",
    borderRadius: "var(--radius)",
    fontSize: "14px",
  },
  elements: {
    card: {
      border: "1px solid hsl(var(--border))",
      boxShadow: "0 0 0 1px hsl(var(--border))",
      backgroundColor: "hsl(var(--card))",
    },
    headerTitle: {
      color: "hsl(var(--foreground))",
    },
    headerSubtitle: {
      color: "hsl(var(--muted-foreground))",
    },
    socialButtonsIconButton: {
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    socialButtonsBlockButton: {
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--card))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    formButtonPrimary: {
      backgroundColor: "hsl(var(--primary))",
      borderColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--primary))",
        opacity: 0.9,
      },
    },
    formButtonReset: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        color: "hsl(var(--primary))",
      },
    },
    footerActionLink: {
      color: "hsl(var(--primary))",
      "&:hover": {
        color: "hsl(var(--primary))",
        opacity: 0.8,
      },
    },
    footerActionText: {
      color: "hsl(var(--muted-foreground))",
    },
    dividerLine: {
      backgroundColor: "hsl(var(--border))",
    },
    dividerText: {
      color: "hsl(var(--muted-foreground))",
    },
    formFieldInput: {
      borderColor: "hsl(var(--input))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      "&:focus": {
        borderColor: "hsl(var(--ring))",
        boxShadow: "0 0 0 1px hsl(var(--ring))",
      },
      "&::placeholder": {
        color: "hsl(var(--muted-foreground))",
      },
    },
    formFieldLabel: {
      color: "hsl(var(--foreground))",
    },
    formFieldHintText: {
      color: "hsl(var(--muted-foreground))",
    },
    formFieldErrorText: {
      color: "hsl(var(--destructive))",
    },
    otpCodeFieldInput: {
      color: "hsl(var(--foreground))",
      borderColor: "hsl(var(--input))",
      backgroundColor: "hsl(var(--background))",
      "&:focus": {
        borderColor: "hsl(var(--ring))",
        boxShadow: "0 0 0 1px hsl(var(--ring))",
      },
    },
    alert: {
      color: "hsl(var(--foreground))",
    },
    alertText: {
      color: "hsl(var(--foreground))",
    },
    backLink: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        color: "hsl(var(--primary))",
      },
    },
    identityPreviewText: {
      color: "hsl(var(--foreground))",
    },
    identityPreviewEditButton: {
      color: "hsl(var(--primary))",
    },
    userButtonBox: {
      color: "hsl(var(--foreground))",
    },
    userButtonOuterIdentifier: {
      color: "hsl(var(--muted-foreground))",
    },
    userButtonTrigger: {
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    // UserButton dropdown menu styling
    userButtonPopoverCard: {
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "var(--radius)",
    },
    userButtonPopoverActionButton: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
      },
    },
    userButtonPopoverActionButtonText: {
      color: "hsl(var(--foreground))",
    },
    userButtonPopoverFooter: {
      backgroundColor: "hsl(var(--muted))",
      borderTop: "1px solid hsl(var(--border))",
    },
    modalBackdrop: {
      backdropFilter: "blur(4px)",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    // Additional text elements that might need styling
    body: {
      color: "hsl(var(--foreground))",
      backgroundColor: "hsl(var(--background))",
    },
    main: {
      color: "hsl(var(--foreground))",
      backgroundColor: "hsl(var(--background))",
    },
    // User Profile social connection buttons
    profilePage: {
      backgroundColor: "hsl(var(--background))",
    },
    profileSection: {
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
    },
    profileSectionTitleText: {
      color: "hsl(var(--foreground))",
    },
    profileSectionContent: {
      backgroundColor: "hsl(var(--card))",
    },
    providerIcon: {
      color: "hsl(var(--foreground))",
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    socialButtonsProviderIcon: {
      color: "hsl(var(--foreground))",
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    // User Profile action buttons
    profileAction__disconnect: {
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--destructive))",
        opacity: 0.9,
      },
    },
    profileAction__connect: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--primary))",
        opacity: 0.9,
      },
    },
    // User Profile menu/action buttons (three dots menu)
    profileActionButton: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    menuButton: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    actionButton: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    dropdownButton: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    userProfileMenuButton: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    // User Profile Avatar/Profile Picture section
    avatarBox: {
      backgroundColor: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "var(--radius)",
    },
    avatarImage: {
      borderRadius: "var(--radius)",
    },
    avatarImageActions: {
      backgroundColor: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "var(--radius)",
    },
    avatarImageActionsUpload: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      border: "1px solid hsl(var(--primary))",
      "&:hover": {
        backgroundColor: "hsl(var(--primary))",
        opacity: 0.9,
      },
    },
    avatarImageActionsRemove: {
      color: "hsl(var(--foreground))",
      backgroundColor: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
    // Additional profile section styling
    profileSectionHeaderTitle: {
      color: "hsl(var(--foreground))",
    },
    profileSectionHeaderIcon: {
      color: "hsl(var(--foreground))",
    },
    profileSectionButton: {
      color: "hsl(var(--foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
    },
  },
};
