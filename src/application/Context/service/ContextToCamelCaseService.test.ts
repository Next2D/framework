import { execute } from "./ContextToCamelCaseService";
import { describe, expect, it } from "vitest";

describe("ContextToCamelCaseService Test", () =>
{
    it("execute test case1", () =>
    {
        expect(execute("home")).toBe("Home");
    });

    it("execute test case2", () =>
    {
        expect(execute("quest/list")).toBe("QuestList");
    });

    it("execute test case3", () =>
    {
        expect(execute("game/list/page")).toBe("GameListPage");
    });

    it("execute test case4 - hyphen separator", () =>
    {
        expect(execute("user-profile")).toBe("UserProfile");
    });

    it("execute test case5 - underscore separator", () =>
    {
        expect(execute("user_settings")).toBe("UserSettings");
    });

    it("execute test case6 - mixed separators", () =>
    {
        expect(execute("game/user-profile_page")).toBe("GameUserProfilePage");
    });

    it("execute test case7 - multiple hyphens", () =>
    {
        expect(execute("my-awesome-component")).toBe("MyAwesomeComponent");
    });

    it("execute test case8 - multiple underscores", () =>
    {
        expect(execute("my_awesome_component")).toBe("MyAwesomeComponent");
    });
});