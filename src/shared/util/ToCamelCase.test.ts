import { toCamelCase } from "./ToCamelCase";
import { describe, expect, it } from "vitest";

describe("ToCamelCase Test", () =>
{
    it("should convert single word", () =>
    {
        expect(toCamelCase("home")).toBe("Home");
    });

    it("should convert slash separated path", () =>
    {
        expect(toCamelCase("quest/list")).toBe("QuestList");
    });

    it("should convert multi-level path", () =>
    {
        expect(toCamelCase("game/list/page")).toBe("GameListPage");
    });

    it("should convert hyphen separated words", () =>
    {
        expect(toCamelCase("user-profile")).toBe("UserProfile");
    });

    it("should convert underscore separated words", () =>
    {
        expect(toCamelCase("user_settings")).toBe("UserSettings");
    });

    it("should convert mixed separators", () =>
    {
        expect(toCamelCase("game/user-profile_page")).toBe("GameUserProfilePage");
    });

    it("should convert multiple hyphens", () =>
    {
        expect(toCamelCase("my-awesome-component")).toBe("MyAwesomeComponent");
    });

    it("should convert multiple underscores", () =>
    {
        expect(toCamelCase("my_awesome_component")).toBe("MyAwesomeComponent");
    });
});
