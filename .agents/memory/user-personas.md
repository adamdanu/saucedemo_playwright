# Memory: SauceDemo User Personas & Behaviors

## User Profiles
1. **`standard_user`**: Normal user flow. All features work as expected.
2. **`locked_out_user`**: Blocked at login with red lockout error banner.
3. **`problem_user`**:
   - All product images replaced by broken dog image (`sl-404.168b1cce.jpg`).
   - Remove button in cart does not work properly for certain items.
   - Last name field in checkout does not accept input.
4. **`performance_glitch_user`**:
   - Artificial 5-second delay on login and page loads. Tests must rely on auto-waiting rather than low custom timeouts.
5. **`error_user`**:
   - Certain buttons throw unhandled client errors or fail silently.
6. **`visual_user`**:
   - Visual alignment glitches (checkout button misaligned, icon offsets).
