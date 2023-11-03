local p = {}
local _ = {}

_.separator = "&nbsp;•&nbsp;";

-- Utility functions
_.flipTable = function(table)
    local flippedTable = {}
    for k, v in pairs(table) do
        flippedTable[v] = k
    end
    return flippedTable
end

_.sanitizeNum = function(num)
    return num <= 0 and "МЭӨ " .. math.abs(num) + 1 or num
end

_.sanitizeDecade = function(num)
    return num * 10 < 0 and "МЭӨ " .. math.abs(num) - 10 or num
end

-- Generate categoryLink for specific date unit
_.generateCategory = function(dateUnit, typeOfLink, typeOfDate, topic)
    -- typeOfLink: startlink, endlink, currentlink, normallink
    -- typeOfDate: millennium, century, decade, year
    topic = topic or ""
    local dateSuffix = {
        millennium = { "-р мянган", "-р" },
        century = { "-р зуун", "-р" },
        decade = { "-д он", "-д" },
        year = { " он", "" },
    }
    local actualLink = dateUnit .. dateSuffix[typeOfDate][1] .. topic
    local visibleLink = {
        startlink = "◄",
        endlink = "►",
        currentlink = actualLink,
        normallink = dateUnit .. dateSuffix[typeOfDate][2],
    }

    local fullLink = (typeOfLink == "currentlink" and "'''" or "") ..
        "[[:Ангилал:" .. actualLink .. "|" .. visibleLink[typeOfLink] .. "]]" ..
        (typeOfLink == "currentlink" and "'''" or "")
    local greyLink = (typeOfLink == "currentlink" and "'''" or "") ..
        "<span style='color:#808080'>" .. visibleLink[typeOfLink] .. "</span>" ..
        (typeOfLink == "currentlink" and "'''" or "")

    if mw.title.new(actualLink, "Category").exists == true then
        return fullLink
    else
        return greyLink
    end

    -- Simplified for debuging
    -- return (typeOfLink == "currentlink" and "'''" or "") ..
    --     "[[" .. actualLink .. "]]" .. (typeOfLink == "currentlink" and "'''" or "")
end

_.millennium = function(year, dateType, topic)
    local millennium = {}
    local val = math.floor((year < 0 and (year - 1) or year) / 1000)

    local indexes = {
        startlink = 0,
        endlink = 2,
        currentlink = 1,
    }
    if (dateType == "century" or dateType == "millennium") then
        indexes = {
            startlink = year >= 0 and -1 or 0,
            endlink = year >= 0 and 3 or 4,
            currentlink = year >= 0 and 1 or 2,
        }
    end
    local flippedIndexes = _.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink do
        table.insert(millennium,
            _.generateCategory(_.sanitizeNum(val + i), flippedIndexes[i] or "normallink", "millennium", topic))
    end

    return table.concat(millennium, _.separator)
end

_.century = function(year, dateType, topic)
    local century = {}
    local val = math.floor((year < 0 and (year + 1) or year) / 100)
    local indexes = {
        startlink = year >= 0 and -1 or -2,
        endlink = year >= 0 and 3 or 2,
        currentlink = year >= 0 and 1 or 0,
    }
    if (dateType == "millennium") then
        indexes = {
            startlink = 1,
            endlink = 10,
        }
    elseif (dateType == "century") then
        indexes = {
            startlink = -2,
            endlink = 4,
            currentlink = 1,
        }
    end
    local flippedIndexes = _.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink do
        table.insert(century,
            _.generateCategory(_.sanitizeNum(val + i),
                dateType == "millennium" and "normallink" or (flippedIndexes[i] or "normallink"),
                "century", topic))
    end

    return table.concat(century, _.separator)
end

_.decade = function(year, dateType, topic)
    local decade = {}
    local val = math.floor((year < 0 and (year - 1) or year) / 10) * 10
    local indexes = {
        startlink = -40,
        endlink = 40,
        currentlink = 0,
    }
    if (dateType == "century") then
        indexes = {
            startlink = year >= 0 and 0 or 10,
            endlink = year >= 0 and 90 or 100,
        }
    end
    local flippedIndexes = _.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink, 10 do
        table.insert(decade,
            _.generateCategory(_.sanitizeDecade(val + i),
                dateType == "century" and "normallink" or (flippedIndexes[i] or "normallink"),
                "decade", topic))
    end

    return table.concat(decade, _.separator)
end

_.year = function(year, dateType, topic)
    local retYear = {}
    local tempnum = (year < 0 and (year + 1)) or year
    local val = tempnum
    local indexes = {
        startlink = -4,
        endlink = 4,
        currentlink = 0,
    }
    if (dateType == "decade") then
        val = math.floor(tempnum / 10) * 10
        indexes = {
            startlink = year >= 0 and 0 or -8,
            endlink = year >= 0 and 9 or 1,
        }
        if year == 1 then
            indexes = {
                startlink = 1,
                endlink = 9,
            }
        end
        if year == -1 then
            indexes = {
                startlink = -8,
                endlink = 0,
            }
        end
    end

    local flippedIndexes = _.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink, 1 do
        table.insert(retYear, _.generateCategory(_.sanitizeNum(val + i),
            dateType == "decade" and "normallink" or (flippedIndexes[i] or "normallink"),
            "year", topic))
    end

    return table.concat(retYear, _.separator)
end

-- Generate the main category templates
_.yearCat = function(num, topic, minimal)
    if num == 0 then
        error("Invalid date")
    end

    if minimal then
        if minimal == "nodecade" then
            return table.concat({
                _.century(num, nil, topic),
                _.year(num, nil, topic) }, "\n<br />\n")
        end
        return table.concat({
            _.decade(num, nil, topic),
            _.year(num, nil, topic) }, "\n<br />\n")
    end

    return table.concat({ _.millennium(num, nil, topic),
        _.century(num, nil, topic),
        _.decade(num, nil, topic),
        _.year(num, nil, topic) }, "\n<br />\n")
end

-- Instead of 0s AD, use 1
-- Instead of 0s BC use -1
-- For everything else use 10,-10, 1920, -1920 etc.
_.decadeCat = function(num, topic, minimal)
    if math.abs(num) ~= 1 and math.abs(num % 10) ~= 0 then
        error("Invalid date")
    end
    if minimal then
        return table.concat({
            _.century(num, nil, topic),
            _.decade(num, "decade", topic),
            _.year(num, "decade", topic) }, "\n<br />\n")
    end
    return table.concat({ _.millennium(num, nil, topic),
        _.century(num, nil, topic),
        _.decade(num, "decade", topic),
        _.year(num, "decade", topic) }, "\n<br />\n")
end

_.centuryCat = function(num, topic, minimal)
    if num == 0 then
        error("Invalid date")
    end

    if (num < 0) then
        num = num * 100
    else
        num = (num - 1) * 100
    end

    if minimal == "nodecade" then
        return table.concat({ _.millennium(num, "century", topic),
            _.century(num, "century", topic) }, "\n<br />\n")
    end

    return table.concat({ _.millennium(num, "century", topic),
        _.century(num, "century", topic),
        _.decade(num, "century", topic) }, "\n<br />\n")
end

_.millenniumCat = function(num, topic)
    if num == 0 then
        error("Invalid date")
    end

    if (num < 0) then
        num = num * 1000
    else
        num = (num - 1) * 1000
    end
    return table.concat({ _.millennium(num, "millennium", topic),
        _.century(num, "millennium", topic) }, "\n<br />\n")
end

_.getPageInfo = function(currentPage, minimal)
    local dateType = nil
    local topic = ""
    local bcOrAd = string.find(currentPage, "МЭӨ") and "МЭӨ" or ""
    local numFromPage = tonumber(string.match(currentPage, "%d+"))
    local signedNumFromPage = numFromPage
    if (bcOrAd == "МЭӨ") then signedNumFromPage = -signedNumFromPage end
    local categories = {}
    local fullDate = ""

    -- should be first
    if string.match(currentPage, "%d+-д он") then
        -- decade
        dateType = "decade"
        topic = string.match(currentPage, '%d+-д он(.+)') or ""
        if numFromPage == 0 and bcOrAd == "МЭӨ" then signedNumFromPage = -1 end
        if numFromPage == 0 and bcOrAd == "" then signedNumFromPage = 1 end
        table.insert(
            categories, (bcOrAd == "МЭӨ" and "МЭӨ " or "") ..
            math.floor(numFromPage / 100) + 1 .. "-р зуун" .. topic
        )
        fullDate = (bcOrAd == "МЭӨ" and "МЭӨ " or "") .. string.match(currentPage, "%d+-д он")
    elseif string.match(currentPage, "%d+ он") then
        -- year
        dateType = "year"
        topic = string.match(currentPage, '%d+ он(.+)') or ""
        if minimal and minimal == "nodecade" then
            table.insert(
                categories, (bcOrAd == "МЭӨ" and "МЭӨ " or "") ..
                math.floor(numFromPage / 100) + 1 .. "-р зуун" .. topic
            )
        else
            table.insert(categories,
                (bcOrAd == "МЭӨ" and "МЭӨ " or "") .. math.floor(numFromPage / 10) * 10 .. "-д он" .. topic)
        end
        fullDate = (bcOrAd == "МЭӨ" and "МЭӨ " or "") .. string.match(currentPage, "%d+ он")
    elseif string.match(currentPage, "%d+-р зуун") then
        -- century
        dateType = "century"
        topic = string.match(currentPage, '%d+-р зуун(.+)') or ""
        if not minimal then
            table.insert(
                categories, (bcOrAd == "МЭӨ" and "МЭӨ " or "") ..
                math.floor(numFromPage * 100 / 1000) + 1 .. "-р мянган" .. topic
            )
        end
        fullDate = (bcOrAd == "МЭӨ" and "МЭӨ " or "") .. string.match(currentPage, "%d+-р зуун")
    elseif string.match(currentPage, "%d+-р мянган") then
        -- millennium
        dateType = "millennium"
        topic = string.match(currentPage, '%d+-р мянган(.+)') or ""
        fullDate = (bcOrAd == "МЭӨ" and "МЭӨ " or "") .. string.match(currentPage, "%d+-р мянган")
    else
        error("Invalid date")
    end

    return {
        ['numFromPage'] = signedNumFromPage,
        ['topic'] = topic,
        ['dateType'] = dateType,
        ['categories'] = categories,
        ['fullDate'] = fullDate
    }
end

p.categorySort = function(frame)
    local title = frame.args[1]
    local pageInfo = _.getPageInfo(title)
    if pageInfo['numFromPage'] < 0 then
        return "!" .. 10000000 - math.abs(pageInfo['numFromPage'])
    end
    return "#" .. string.format("%09d", math.abs(pageInfo['numFromPage']))
end

p.dateType = function(frame)
    local title = frame.args[1]
    local pageInfo = _.getPageInfo(title)
    return pageInfo['dateType']
end

p.fullDate = function(frame)
    local title = frame.args[1]
    local pageInfo = _.getPageInfo(title)
    return pageInfo['fullDate']
end

p.generate = function(frame)
    local title = frame.args[1]
    local minimal = frame.args[2]
    local pageInfo = _.getPageInfo(title, minimal)
    local categorySort = p.categorySort(frame)

    local funcs = {
        year = function() return _.yearCat(pageInfo['numFromPage'], pageInfo['topic'], minimal) end,
        decade = function() return _.decadeCat(pageInfo['numFromPage'], pageInfo['topic'], minimal) end,
        century = function() return _.centuryCat(pageInfo['numFromPage'], pageInfo['topic'], minimal) end,
        millennium = function() return _.millenniumCat(pageInfo['numFromPage'], pageInfo['topic'], minimal) end,
    }

    local categoryList = {}
    for _, value in pairs(pageInfo['categories']) do
        table.insert(categoryList, "[[Ангилал: " .. value .. "|" .. categorySort .. "]]")
    end

    if funcs[pageInfo['dateType']] then
        return "<div {{Цагалбарын хэв}}>\n" ..
            funcs[pageInfo['dateType']]() .. "\n</div>" ..
            table.concat(categoryList, "\n")
    else
        error("Invalid function name")
    end
end

return p
