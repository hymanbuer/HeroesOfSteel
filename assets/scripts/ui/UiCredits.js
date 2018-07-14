
const originCredits = `
Trese Brothers
-------------------
Andrew Trese
    Founder, Artist and Designer
Cory Trese
    Founder, Developer and Designer

Alpha Team
----------------
    A. R. Jackson
    Abs
    Alexander marti
    Allison Perkeybile
    Andrew Matheson
    Antonio Barritta
    beuns
    Big Irons
    Brent Nulph
    Brett McCoy
    C. Brian Bucklew
    Carol Bumbaca
    Charles Parker
    Cheryl and Robert Perkeybile
    Chris Berry
    Chris Ehrisman
    Colin Pickard
    Daniel Notthoff
    Darryl Alison
    drekx
    Elaina And Rowden
    Ferroni Family
    Gravling
    Forantis Voidstar
    Hellion7776
    Ho-Sheng Hsiao
    Jeff Rankin
    Jeffery Bruse
    John Gardner
    John H, McCoy
    John Mirtle
    John Ramey
    Jonathan Hunter Neely, III
    Joran Andrews
    Julio Y. Calcano
    Krakun
    Lab ZFZ
    Lesley Ralph
    Michael 'Greywar' Taylor
    Michael Hausmann
    Nadav Abramovitz
    nails
    NAME REDACTED BY CONGRESS
    Neil Oakman
    Porter Schermerhorn
    Reggie Lawson
    Reuben John
    Roy J. Cline
    Ryan Pavlik
    Shahin Aftabizadeh
    Shellee Stewart
    Starfixer
    Terry Carter
    The First Cat
    vindroid

Many Thanks to Our Backers
---------------------------------------
    13 of 17! Yeah, Baby!
    A Champ
    Adam Work
    Alex Fury
    Alex S-B
    Alton Wilson
    Andrew Duncan
    Andrew Ho
    Andrew Mosqueda-Jones
    Arnie Aldridge
    Art Baker
    ASC
    Ashley Ross
    Ben Pardue
    Bill Walker
    Bob Faist
    Brad Merriman
    careydw
    Carnifex
    Chad Predovich
    Cheyne Johnon
    Ching Dai
    Chng Chyi Da
    Chris Pribanick
    christianne Benner
    Christopher Wilson
    cobi
    Courtney Purchon
    Craig Hart
    Craig M. Burger
    Cyol
    Dan Crocker
    Dan 'Iceman2343' Berends
    Dasharremon
    David Greaves
    David Huttleston Jr
    David S. DeLuca
    David S. Pietka
    David 'Travail' Hoenig
    Donnie Cox
    Douglas Crews
    Duncan Laurie
    Dustin Saunier
    Edward Purcell
    Emily Van Meter
    Enginehouse Studios
    Eternal Understudy Game Design
    Evirae Rathburn
    FH Lockhart III
    Freedom Hater
    GeoBlack
    Gunnar Hgberg
    Harry Yeo
    Hero McMightypants
    His Royal T
    HungryCats
    Iain Gray
    Imphenzia
    InsertDisk2
    Jaime Sykes
    Jason Berrill
    Jason Frey
    Jason R Harr
    Jason Sachan
    Jeffrey Niebres
    Jeffrey Revock
    Jenn Zacks
    Jeremiah Winsley
    Jesse 'Bagel' Arnold
    Joel Karlsson
    John Lavette
    Justin Jelinek
    Kateeliz
    Ken Chang
    Kensh
    Kevin Duffy
    Korshun
    Kyle Winslow
    L. Smith
    Laura Lichtenthal
    Leif Johnson
    Louis Barroso
    Mario Khl
    Mark williamson
    Martin Lai
    Matt Browne
    Matthew Ley
    Max Rhinehart
    Michael D
    Michael Van Ryan
    Mikel Ryskiewicz
    Mikkel Erdal
    Morgan Williams
    Most HateD
    mttgamer
    Nightstar
    Niki Baum
    Nikolas S. Gray
    No thank you.
    Nytefyre
    Oliver Christensen
    Owen M.
    Per Kristian Brastad
    Quiet Fan
    Rak Peth
    Reese Muntean
    Rick G. Mulvhill
    Robert Saint John
    Robert Vernon
    Roger Ovington
    Ron Jessee
    Ryan Percival
    SA_Flarestar
    Sam Curry
    SeaJey
    Shane Trese
    Simon Sherwood
    Spookctr
    Steffen W. Jonassen
    Stephan Szabo
    Stephen H
    Steven W. Wiklkinson
    strega15
    TeeWee Herman
    Terry Duchastel
    the blight
    THE Kevin
    The Real Doogie
    The Mango
    Theodore Bruce Tyndall III
    Thomas Flender
    Todd Babberl
    Todd R Carpenter
    Tomer Rubin
    Tony Denys
    Vassar Pierce
    Vintoks
    Weapon Lord Zero
    Wim ten Brink
    wwww.gnut.co.uk
    Wylie Gunn
    xdesperado
    XeniXeraX
    Yurak
    Zack K
    Zeke Tamayo
`;

cc.Class({
    extends: cc.Component,

    properties: {
        originCredits: cc.Label,
    },

    start () {
        this.originCredits.string = originCredits;
    },

    onClickBack () {
        this.node.destroy();
    },
});