# Omodeo — Contact page (Roundable #909, #910, #911, #913)

Designer changes only (no code). Published to staging.

- #909 (1512px): intro paragraph "Share a few details..." wrapped in `.contact-intro-text` (max-width 26rem).
- #910 (991px): `.image-wrapper-new.image-contact-form` aspect-ratio auto at Tablet, so the image stretches to the left column height (grid item).
- #913 (402px): same combo, aspect-ratio 4/5 at Mobile portrait (was 1/1); 1/1 kept at Mobile landscape.
- #911 (991px): last form field ("Message") replaced by a `<textarea>` (FormTextarea, name Message, class `text-field message-field`, min-height 10rem, resize vertical).
  The old text input (id `name`, name "Name") was removed. Form field names: First Name, Last Name, Email, Company, Project Type, Message.
