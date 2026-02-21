---
name: react-native-patterns
description: React Native and Expo best practices from official Expo skills (score 10) and Vercel Labs (score 9.6). Navigation, performance, native UI patterns.
source: |
  https://github.com/expo/skills (score 10)
  https://github.com/vercel-labs/agent-skills (score 9.6)
---

# React Native & Expo — Best Practices Reference

## Navigation with Expo Router

### Native Tabs

```tsx
// app/_layout.tsx
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function Layout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(search)" role="search" />
    </NativeTabs>
  );
}
```

### Stack with Form Sheet Modal

```tsx
<Stack>
  <Stack.Screen name="index" options={{ title: "Home" }} />
  <Stack.Screen
    name="confirm"
    options={{
      presentation: "formSheet",
      sheetGrabberVisible: true,
      sheetAllowedDetents: [0.25],
      headerTransparent: true,
    }}
  />
</Stack>
```

### Stack Inside Tabs

```tsx
// app/(tabs)/(home)/_layout.tsx
import Stack from "expo-router/stack";

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerLargeTitle: true }} />
      <Stack.Screen name="details" options={{ title: "Details" }} />
    </Stack>
  );
}
```

## Performance Patterns

### Priority Order

| Priority | Category | Examples |
|---|---|---|
| **CRITICAL** | List performance | FlashList, memoization, callbacks |
| **HIGH** | Animation | Reanimated, GPU properties |
| **HIGH** | UI | expo-image, native modals |
| **MEDIUM** | React state | State minimization, dispatcher |
| **MEDIUM** | Rendering | Text wrapping, conditional rendering |

### List Virtualization (MANDATORY)

```tsx
// ❌ BAD — ScrollView renders ALL items
<ScrollView>
  {items.map((item) => <ItemCard key={item.id} item={item} />)}
</ScrollView>
// 50 items = 50 components mounted

// ✅ GOOD — FlashList renders only visible items
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={50}
/>
// Only ~10-15 visible items mounted
```

### Memoized List Items

```tsx
// ❌ BAD — inline styles create new objects per render
<FlatList
  renderItem={({ item }) => (
    <View style={{ padding: 16 }}><Text>{item.name}</Text></View>
  )}
/>

// ✅ GOOD — memoized component + hoisted styles
const ItemComponent = memo(({ item }) => (
  <View style={styles.item}><Text>{item.name}</Text></View>
))

const styles = StyleSheet.create({
  item: { padding: 16 }
})
```

## Native Modals (not JS bottom sheets)

```tsx
// ❌ BAD — JS-based bottom sheet
<BottomSheet ref={sheetRef} snapPoints={['50%', '90%']}>
  <View><Text>Sheet content</Text></View>
</BottomSheet>

// ✅ GOOD — Native Modal
<Modal visible={visible} presentationStyle="formSheet" animationType="slide">
  <View><Text>Sheet content</Text></View>
</Modal>

// ✅ GOOD — Expo Router form sheet
<Stack.Screen
  name="Details"
  options={{
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',
  }}
/>
```

## Compound Components Pattern

```tsx
// ❌ BAD — boolean props explosion
<Card showHeader showFooter headerTitle="Title" footerButtons={[...]} />

// ✅ GOOD — compound composition
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

## Rules

- **Always** use FlashList or LegendList for scrollable lists
- **Always** use `StyleSheet.create` — never inline style objects
- **Prefer** native modals over JS bottom sheets
- **Use** NativeTabs over JS Tabs for tab navigation
- **Memoize** list item components with `React.memo`
- **Follow** Apple HIG for native look and feel
