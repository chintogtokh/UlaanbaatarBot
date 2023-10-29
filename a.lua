local p = {}

p.separator = "&nbsp;•&nbsp;";

-- Utility functions
p.flipTable = function(table)
    local flippedTable = {}
    for k, v in pairs(table) do
        flippedTable[v] = k
    end
    return flippedTable
end

p.sanitizeNum = function(num)
    return num <= 0 and "МЭӨ " .. math.abs(num) + 1 or num
end

p.sanitizeDecade = function(num)
    return num * 10 < 0 and "МЭӨ " .. math.abs(num) - 10 or num
end

-- Generate categoryLink for specific date unit
p.generateCategory = function(dateUnit, typeOfLink, typeOfDate, topic)
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

p.millennium = function(year, dateType, topic)
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
    local flippedIndexes = p.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink do
        table.insert(millennium,
            p.generateCategory(p.sanitizeNum(val + i), flippedIndexes[i] or "normallink", "millennium", topic))
    end

    return table.concat(millennium, p.separator)
end

p.century = function(year, dateType, topic)
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
    local flippedIndexes = p.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink do
        table.insert(century,
            p.generateCategory(p.sanitizeNum(val + i),
                dateType == "millennium" and "normallink" or (flippedIndexes[i] or "normallink"),
                "century", topic))
    end

    return table.concat(century, p.separator)
end

p.decade = function(year, dateType, topic)
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
    local flippedIndexes = p.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink, 10 do
        table.insert(decade,
            p.generateCategory(p.sanitizeDecade(val + i),
                dateType == "century" and "normallink" or (flippedIndexes[i] or "normallink"),
                "decade", topic))
    end

    return table.concat(decade, p.separator)
end

p.year = function(year, dateType, topic)
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

    local flippedIndexes = p.flipTable(indexes)

    for i = indexes.startlink, indexes.endlink, 1 do
        table.insert(retYear, p.generateCategory(p.sanitizeNum(val + i),
            dateType == "decade" and "normallink" or (flippedIndexes[i] or "normallink"),
            "year", topic))
    end

    return table.concat(retYear, p.separator)
end

-- Generate list of categories
p.yearCat = function(num, topic)
    if num == 0 then
        error("Invalid date")
    end

    return table.concat({ p.millennium(num, nil, topic),
        p.century(num, nil, topic),
        p.decade(num, nil, topic),
        p.year(num, nil, topic) }, "\n<br />\n")
end

-- Instead of 0, use 1 ; -0 use 1; for everything else use 10,-10, 1920, -1920 etc.
p.decadeCat = function(num, topic)
    if math.abs(num) ~= 1 and math.abs(num % 10) ~= 0 then
        error("Invalid date")
    end
    return table.concat({ p.millennium(num, nil, topic),
        p.century(num, nil, topic),
        p.decade(num, "decade", topic),
        p.year(num, "decade", topic) }, "\n<br />\n")
end

p.centuryCat = function(num, topic)
    if num == 0 then
        error("Invalid date")
    end

    if (num < 0) then
        num = num * 100
    else
        num = (num - 1) * 100
    end
    return table.concat({ p.millennium(num, "century", topic),
        p.century(num, "century", topic),
        p.decade(num, "century", topic) }, "\n<br />\n")
end

p.millenniumCat = function(num, topic)
    if num == 0 then
        error("Invalid date")
    end

    if (num < 0) then
        num = num * 1000
    else
        num = (num - 1) * 1000
    end
    return table.concat({ p.millennium(num, "millennium", topic),
        p.century(num, "millennium", topic) }, "\n<br />\n")
end

p.main = function(frame)
    local functype = frame.args[1]
    local num = tonumber(frame.args[2])
    local topic = frame.args[3] or ""

    topic = topic or ""
    local funcs = {
        year = function() return p.yearCat(num, topic) end,
        decade = function() return p.decadeCat(num, topic) end,
        century = function() return p.centuryCat(num, topic) end,
        millennium = function() return p.millenniumCat(num, topic) end,
    }
    -- "<h2>" .. num .. functype .. "</h2>" ..
    if funcs[functype] then
        return "<div {{Цагалбарын хэв}}>\n" ..
            funcs[functype]() .. "\n</div>"
    else
        error("Invalid function name")
    end
end

p.generate = function(frame)
    local functype = frame.args[1]
    local num = tonumber(frame.args[2])
    local topic = frame.args[3] or ""

    topic = topic or ""
    local funcs = {
        year = function() return p.yearCat(num, topic) end,
        decade = function() return p.decadeCat(num, topic) end,
        century = function() return p.centuryCat(num, topic) end,
        millennium = function() return p.millenniumCat(num, topic) end,
    }
    -- "<h2>" .. num .. functype .. "</h2>" ..
    if funcs[functype] then
        return "<div {{Цагалбарын хэв}}>\n" ..
            funcs[functype]() .. "\n</div>"
    else
        error("Invalid function name")
    end
end

return p
