---
title: The United States Constitution
scope:
    Interact: ../js/interact.jsx
    Pointer: ../js/pointer.jsx
    House: ../js/house.jsx
    Senate: ../js/senate.jsx
    Congress: ../js/congress.jsx
    States: ../js/states.jsx
    Populations: ../js/populations.jsx
    Stepper: ../js/stepper.jsx
---

#The United States Constitution

We the People of the United States, in Order to form a more perfect Union,
establish Justice, insure domestic Tranquility, provide for the common
defence, promote the general Welfare, and secure the Blessings of Liberty to
ourselves and our Posterity, do ordain and establish this Constitution for the
United States of America.

##Article 1.

###Section 1

All legislative Powers herein granted shall be vested in a <Pointer ident="congress-sec1">Congress of the
United States</Pointer>, which shall consist of a <Pointer ident="congress-sec1/senate">Senate</Pointer> and <Pointer ident="congress-sec1/house">House of Representatives</Pointer>.

<Interact width={240} height={150} style={{margin: '0 auto', display: 'block'}}>
<Congress ident="congress-sec1" />
</Interact>

###Section 2

The <Pointer ident="house-sec2">House of Representatives</Pointer> shall be composed of Members <Pointer>chosen</Pointer> every second
Year by the People of the several States, and the Electors in each State shall
have the Qualifications requisite for Electors of the most numerous Branch of
the State Legislature.

<Interact width={600} height={600} style={{margin: '0 auto', display: 'block'}}>
<House x={100} ident="house-sec2" />
<Stepper x={250} centerY={35} step={2}>
<House />
</Stepper>
<States choosing="house" y={100}/>
</Interact>

No Person shall be a Representative who shall not have attained to the Age of
twenty five Years, and been seven Years a Citizen of the United States, and who
shall not, when elected, be an Inhabitant of that State in which he shall be
chosen.

Representatives and direct Taxes shall be apportioned among the several States
which may be included within this Union, according to their respective Numbers,
which shall be determined by adding to the whole Number of free Persons,
including those bound to Service for a Term of Years, and excluding Indians not
taxed, three fifths of all other Persons.

<Interact width={150} height={800} style={{float: 'right'}}>
<Populations />
</Interact>

The actual Enumeration shall be made within three Years after the first Meeting
of the Congress of the United States, and within every subsequent Term of ten
Years, in such Manner as they shall by Law direct. The Number of
Representatives shall not exceed one for every thirty Thousand, but each State
shall have at Least one Representative; and until such enumeration shall be
made, the State of New Hampshire shall be entitled to choose three,
Massachusetts eight, Rhode Island and Providence Plantations one, Connecticut
five, New York six, New Jersey four, Pennsylvania eight, Delaware one, Maryland
six, Virginia ten, North Carolina five, South Carolina five and Georgia three.

When vacancies happen in the Representation from any State, the Executive
Authority thereof shall issue Writs of Election to fill such Vacancies.

The House of Representatives shall choose their Speaker and other Officers; and
shall have the sole Power of Impeachment.

###Section 3

The <Pointer ident="senate-sec3">Senate of the United States</Pointer> shall be composed of <Pointer>two Senators from each
State</Pointer>, chosen by the <Pointer>Legislature</Pointer> thereof, for six Years; and each Senator shall
have one Vote.

<Interact width={600} height={270} style={{margin: '0 auto', display: 'block'}}>
<Senate x={100} ident="senate-sec3" />
<Stepper x={250} centerY={5} step={6}>
<Senate />
</Stepper>
<States choosing="senate" y={80}/>
</Interact>

Immediately after they shall be assembled in Consequence of the first Election,
they shall be divided as equally as may be into three Classes. The Seats of the
Senators of the <Pointer ident="senate-sec3/first-class">first Class</Pointer> shall be vacated at the Expiration of the second
Year, of the <Pointer ident="senate-sec3/first-class">second Class</Pointer> at the Expiration of the fourth Year, and of the <Pointer ident="senate-sec3/third-class">third Class</Pointer> at the Expiration of the sixth Year, so that one third may be
chosen every second Year; and if Vacancies happen by Resignation, or otherwise,
during the Recess of the Legislature of any State, the Executive thereof may
make temporary Appointments until the next Meeting of the Legislature, which
shall then fill such Vacancies.

No person shall be a Senator who shall not have attained to the Age of thirty
Years, and been nine Years a Citizen of the United States, and who shall not,
when elected, be an Inhabitant of that State for which he shall be chosen.

The Vice President of the United States shall be President of the Senate, but
shall have no Vote, unless they be equally divided.

The Senate shall choose their other Officers, and also a President pro tempore,
in the absence of the Vice President, or when he shall exercise the Office of
President of the United States.

The Senate shall have the sole Power to try all Impeachments. When sitting for
that Purpose, they shall be on Oath or Affirmation. When the President of the
United States is tried, the Chief Justice shall preside: And no Person shall be
convicted without the Concurrence of two thirds of the Members present.

Judgment in Cases of Impeachment shall not extend further than to removal from
Office, and disqualification to hold and enjoy any Office of honor, Trust or
Profit under the United States: but the Party convicted shall nevertheless be
liable and subject to Indictment, Trial, Judgment and Punishment, according to
Law.
