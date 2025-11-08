'use client'

import { InkeepChatButton } from '@inkeep/cxkit-react'
import type { FC } from 'react'

export const ChatButton: FC = () => {
  return (
    <InkeepChatButton
      aiChatSettings={{
        aiAssistantAvatar: '/icon.svg',
        aiAssistantName: 'Inkeep'
      }}
      baseSettings={{
        apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
        primaryBrandColor: '#238aff',
        colorMode: {
          sync: {
            target: 'html',
            attributes: ['class'],
            isDarkMode(attrs) {
              return attrs.class === 'dark'
            }
          }
        },
        theme: {
          styles: [
            {
              key: 'custom-theme',
              type: 'style',
              // Fix icon on light theme
              value: `
                [data-theme=light] .ikp-chat-button__avatar-content {
                  filter: invert(1);
                }
              `
            }
          ]
        }
      }}
    />
  )
}
