# THREE Next.js

1. **Create component**
    ```shell
    # The component scopes (to build the dependency tree levels) are: L0, L1, L2, L3, L4
    cd auto

    # py component.py componentScope componentName
    py component.py L0 MyComponent
    # Which will create:
    # ./components/
    # ./components/L0
    # ./components/L0/MyComponent
    # ./components/L0/MyComponent/index.ts
    # ./components/L0/MyComponent/styles.module.scss
    ```

    If more scopes are needed they can be added at auto/modules/export.py

2. **Create 3D scene**
    ```shell
    cd auto

    py scene.py
    >> Scene name: MyScene3D
    # Which will create:
    # ./scenes/
    # ./scenes/SceneName
    # ./scenes/SceneName/index.ts
    # ./scenes/SceneName/scene.ts
    # ./pages/scenename.tsx
    ```

3. **Create Recoil.js state**
    ```shell
    cd auto

    py scene.py
    >> State name: StateName
    # Which will create an atom at:
    # ./state/
    # ./state/StateName
    # ./state/StateName/index.ts
    ```

4. **Set all exports**

    Use this command whenever creating new folders in:

        -   state
        -   components
        -   utils
        -   scenes

    If more folders are needed they can be added at auto/modules/export.py

    ```shell
    cd auto

    py .\modules\export.py
    ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
