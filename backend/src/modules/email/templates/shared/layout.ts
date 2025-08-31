export const wrapInLayout = (content: string) => `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      ${content}
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #999;">
        This is an automated email from SMS Platform.
      </p>
    </div>
  </div>
`;
