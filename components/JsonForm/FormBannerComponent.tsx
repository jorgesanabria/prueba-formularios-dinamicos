import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Info, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { FormBanner, FormTheme } from '@/types/formTypes';

interface FormBannerComponentProps {
  banner: FormBanner;
  theme: FormTheme;
}

export const FormBannerComponent: React.FC<FormBannerComponentProps> = ({
  banner,
  theme,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const getIcon = () => {
    const iconSize = 20;
    const iconColor = banner.style?.titleColor || getDefaultIconColor();

    switch (banner.type) {
      case 'info':
        return <Info size={iconSize} color={iconColor} />;
      case 'warning':
        return <AlertTriangle size={iconSize} color={iconColor} />;
      case 'error':
        return <AlertCircle size={iconSize} color={iconColor} />;
      case 'success':
        return <CheckCircle size={iconSize} color={iconColor} />;
      default:
        return <Info size={iconSize} color={iconColor} />;
    }
  };

  const getDefaultIconColor = () => {
    switch (banner.type) {
      case 'info':
        return theme.infoColor;
      case 'warning':
        return theme.warningColor;
      case 'error':
        return theme.errorColor;
      case 'success':
        return theme.successColor;
      default:
        return theme.infoColor;
    }
  };

  const getDefaultBackgroundColor = () => {
    switch (banner.type) {
      case 'info':
        return theme.infoColor + '10';
      case 'warning':
        return theme.warningColor + '10';
      case 'error':
        return theme.errorColor + '10';
      case 'success':
        return theme.successColor + '10';
      default:
        return theme.infoColor + '10';
    }
  };

  const bannerStyle = {
    backgroundColor: banner.style?.backgroundColor || getDefaultBackgroundColor(),
    borderColor: banner.style?.borderColor || getDefaultIconColor(),
    borderWidth: banner.style?.borderWidth || 1,
    borderRadius: banner.style?.borderRadius || theme.inputBorderRadius,
    padding: banner.style?.padding || theme.spacing.md,
    margin: banner.style?.margin || theme.spacing.md,
  };

  const titleStyle = {
    color: banner.style?.titleColor || getDefaultIconColor(),
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: banner.title ? theme.spacing.xs : 0,
  };

  const messageStyle = {
    color: banner.style?.textColor || theme.inputTextColor,
    fontSize: 14,
    lineHeight: 20,
  };

  return (
    <View style={[styles.banner, bannerStyle]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.textContainer}>
          {banner.title && (
            <Text style={titleStyle}>{banner.title}</Text>
          )}
          <Text style={messageStyle}>{banner.message}</Text>
        </View>
        {banner.dismissible && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => setIsDismissed(true)}
          >
            <X size={18} color={banner.style?.titleColor || getDefaultIconColor()} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  dismissButton: {
    marginLeft: 12,
    padding: 2,
  },
});